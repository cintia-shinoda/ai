import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import open from 'open';
import { fetchGoogleNews } from './news-service.js';
import { TOPICS } from './topics.js';

/**
 * Clears the terminal screen.
 */
function clearConsole() {
  process.stdout.write('\x1Bc');
}

/**
 * Custom function to format relative time for publication dates.
 * @param {Date|null} date 
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return 'Unknown date';
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Wrapper for prompts that handles Ctrl+C gracefully by exiting.
 */
async function safePrompt(questions) {
  return prompts(questions, {
    onCancel: () => {
      console.log(`\n${pc.yellow('Goodbye!')} 👋`);
      process.exit(0);
    }
  });
}

/**
 * Renders a list of news items in a non-interactive list.
 * @param {object} feed - Parsed RSS feed object
 * @param {string} language 
 * @param {string} country 
 */
export function renderDirectList(feed, language, country) {
  const header = ` 📰 GOOGLE NEWS CLI `;
  const localeInfo = `[${country.toUpperCase()}:${language.toLowerCase()}]`;
  
  console.log(`\n  ${pc.bold(pc.bgBlue(pc.white(header)))} ${pc.cyan(feed.title)} ${pc.dim(localeInfo)}`);
  console.log(pc.dim('━'.repeat(Math.min(process.stdout.columns || 80, 100))));

  if (!feed.items || feed.items.length === 0) {
    console.log(`  ${pc.yellow('No news items found.')}`);
    return;
  }

  feed.items.forEach((item, index) => {
    const num = pc.green(`${index + 1}.`.padStart(3));
    console.log(`\n  ${num} ${pc.bold(item.title)}`);
    console.log(`      ${pc.dim('Source:')} ${pc.magenta(item.source)}  •  ${pc.dim(formatRelativeTime(item.pubDate))}`);
    console.log(`      ${pc.dim('Link:')}   ${pc.blue(item.link)}`);
  });
  console.log('\n');
}

/**
 * Controller class for the interactive CLI loop.
 */
export class InteractiveNewsCLI {
  constructor() {
    this.language = 'en';
    this.country = 'US';
    this.limit = 15;
    this.currentFeed = null;
    this.lastQuery = null;
    this.lastTopic = null;
  }

  /**
   * Starts the interactive main menu loop.
   */
  async start() {
    while (true) {
      clearConsole();
      this.renderWelcomeHeader();

      const { action } = await safePrompt({
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { title: '🗞️  Top Stories', value: 'top' },
          { title: '🏷️  Browse by Topic', value: 'topic' },
          { title: '🔍  Search for News', value: 'search' },
          { title: '⚙️  Settings', value: 'settings' },
          { title: '❌  Exit', value: 'exit' }
        ],
        initial: 0
      });

      if (action === 'exit') {
        console.log(`\n${pc.yellow('Goodbye!')} 👋`);
        process.exit(0);
      }

      if (action === 'top') {
        this.lastQuery = null;
        this.lastTopic = null;
        await this.loadAndShowNews({ limit: this.limit, language: this.language, country: this.country });
      } else if (action === 'topic') {
        await this.handleTopicSelection();
      } else if (action === 'search') {
        await this.handleSearch();
      } else if (action === 'settings') {
        await this.handleSettings();
      }
    }
  }

  renderWelcomeHeader() {
    console.log(pc.cyan('╔' + '═'.repeat(58) + '╗'));
    console.log(pc.cyan('║') + pc.bold(pc.yellow('            🗞️   GOOGLE NEWS TERMINAL BROWSERS            ')) + pc.cyan('║'));
    console.log(pc.cyan('║') + pc.dim(`   Region: ${pc.green(this.country.toUpperCase())}  |  Language: ${pc.green(this.language.toLowerCase())}  |  Show: ${pc.green(this.limit)} articles    `) + pc.cyan('║'));
    console.log(pc.cyan('╚' + '═'.repeat(58) + '╝\n'));
  }

  /**
   * Prompts the user to select a news topic.
   */
  async handleTopicSelection() {
    clearConsole();
    this.renderWelcomeHeader();

    const choices = Object.values(TOPICS).map(topic => ({
      title: topic.name,
      value: topic.code
    }));

    choices.push({ title: '⬅️  Back to Main Menu', value: 'back' });

    const { topicCode } = await safePrompt({
      type: 'select',
      name: 'topicCode',
      message: 'Choose a news topic:',
      choices,
      initial: 0
    });

    if (topicCode === 'back') return;

    this.lastQuery = null;
    this.lastTopic = topicCode;
    await this.loadAndShowNews({
      topic: topicCode,
      limit: this.limit,
      language: this.language,
      country: this.country
    });
  }

  /**
   * Prompts the user for a search query.
   */
  async handleSearch() {
    clearConsole();
    this.renderWelcomeHeader();

    const { query } = await safePrompt({
      type: 'text',
      name: 'query',
      message: 'Enter search term (e.g. "SpaceX", "AI regulation"):',
      validate: val => val.trim().length > 0 ? true : 'Search term cannot be empty.'
    });

    this.lastQuery = query;
    this.lastTopic = null;
    await this.loadAndShowNews({
      search: query,
      limit: this.limit,
      language: this.language,
      country: this.country
    });
  }

  /**
   * Handles interactive configuration settings.
   */
  async handleSettings() {
    clearConsole();
    this.renderWelcomeHeader();

    const { setting } = await safePrompt({
      type: 'select',
      name: 'setting',
      message: 'Modify setting:',
      choices: [
        { title: `🌍  Country/Region (Current: ${this.country})`, value: 'country' },
        { title: `🗣️  Language (Current: ${this.language})`, value: 'language' },
        { title: `🔢  Article Limit (Current: ${this.limit})`, value: 'limit' },
        { title: '⬅️  Back to Main Menu', value: 'back' }
      ]
    });

    if (setting === 'back') return;

    if (setting === 'country') {
      const { newCountry } = await safePrompt({
        type: 'text',
        name: 'newCountry',
        message: 'Enter Country Code (2 letters, e.g. US, GB, BR, JP):',
        initial: this.country,
        validate: val => val.trim().length === 2 ? true : 'Must be a 2-letter code.'
      });
      this.country = newCountry.toUpperCase().trim();
    } else if (setting === 'language') {
      const { newLanguage } = await safePrompt({
        type: 'text',
        name: 'newLanguage',
        message: 'Enter Language Code (2-3 letters, e.g. en, es, fr, pt):',
        initial: this.language,
        validate: val => val.trim().length >= 2 && val.trim().length <= 3 ? true : 'Must be 2 or 3 letters.'
      });
      this.language = newLanguage.toLowerCase().trim();
    } else if (setting === 'limit') {
      const { newLimit } = await safePrompt({
        type: 'number',
        name: 'newLimit',
        message: 'Number of articles to fetch (1-50):',
        initial: this.limit,
        min: 1,
        max: 50
      });
      this.limit = newLimit;
    }
  }

  /**
   * Fetches news and opens the story browser list.
   * @param {object} fetchOptions 
   */
  async loadAndShowNews(fetchOptions) {
    const spinner = ora({
      text: 'Fetching news from Google...',
      color: 'cyan'
    }).start();

    try {
      this.currentFeed = await fetchGoogleNews(fetchOptions);
      spinner.stop();
      await this.showStoryBrowser();
    } catch (err) {
      spinner.fail('Error retrieving news');
      console.log(`\n  ${pc.red('Error details:')} ${err.message}`);
      
      await safePrompt({
        type: 'text',
        name: 'pressEnter',
        message: 'Press Enter to return to the main menu...'
      });
    }
  }

  /**
   * Renders the interactive list of articles.
   */
  async showStoryBrowser() {
    if (!this.currentFeed || !this.currentFeed.items || this.currentFeed.items.length === 0) {
      console.log(`\n  ${pc.yellow('No articles found in this feed.')}`);
      await safePrompt({
        type: 'text',
        name: 'pressEnter',
        message: 'Press Enter to return to the main menu...'
      });
      return;
    }

    while (true) {
      clearConsole();
      console.log(pc.bold(pc.bgMagenta(pc.white(` 📰 ${this.currentFeed.title.toUpperCase()} `))));
      console.log(pc.dim('━'.repeat(Math.min(process.stdout.columns || 80, 100))));

      const choices = this.currentFeed.items.map((item, index) => {
        const timeStr = formatRelativeTime(item.pubDate);
        return {
          title: `${pc.cyan(String(index + 1).padStart(2) + '.')} ${item.title} ${pc.dim(`(${item.source} • ${timeStr})`)}`,
          value: index
        };
      });

      choices.push({ title: pc.yellow('  ⬅️  Back to Main Menu'), value: 'back' });

      const { selection } = await safePrompt({
        type: 'select',
        name: 'selection',
        message: 'Select an article to view details:',
        choices,
        initial: 0
      });

      if (selection === 'back') break;

      await this.showArticleDetails(selection);
    }
  }

  /**
   * Displays details for a single selected article.
   * @param {number} index 
   */
  async showArticleDetails(index) {
    const article = this.currentFeed.items[index];
    if (!article) return;

    while (true) {
      clearConsole();
      console.log(pc.bold(pc.bgBlue(pc.white(' 📄 ARTICLE DETAILS '))));
      console.log(pc.dim('━'.repeat(Math.min(process.stdout.columns || 80, 100))));
      
      console.log(`\n  ${pc.bold(pc.green('Title:'))}      ${pc.bold(article.title)}`);
      console.log(`  ${pc.bold(pc.green('Publisher:'))}  ${pc.magenta(article.source)}`);
      console.log(`  ${pc.bold(pc.green('Published:'))}  ${article.pubDate ? article.pubDate.toString() : 'Unknown'}`);
      console.log(`  ${pc.bold(pc.green('Link:'))}       ${pc.blue(article.link)}`);
      
      console.log(`\n  ${pc.dim('━'.repeat(40))}\n`);

      const { detailAction } = await safePrompt({
        type: 'select',
        name: 'detailAction',
        message: 'Action:',
        choices: [
          { title: '🌐  Open in Default Browser', value: 'open' },
          { title: '⬅️  Back to Article List', value: 'back' },
          { title: '🏠  Back to Main Menu', value: 'main' }
        ]
      });

      if (detailAction === 'open') {
        const spinner = ora('Launching browser...').start();
        try {
          await open(article.link);
          spinner.succeed('Link opened!');
        } catch (err) {
          spinner.fail(`Failed to open link: ${err.message}`);
        }
        
        await safePrompt({
          type: 'text',
          name: 'pressEnter',
          message: 'Press Enter to continue...'
        });
      } else if (detailAction === 'back') {
        break;
      } else if (detailAction === 'main') {
        // We throw a special marker or directly exit back to main menu by bubble-up
        // Let's modify the flow to return to main menu
        this.currentFeed = null; // force clear so we go back
        break;
      }
    }
  }
}
