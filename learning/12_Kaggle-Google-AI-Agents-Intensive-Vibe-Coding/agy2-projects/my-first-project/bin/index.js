#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import ora from 'ora';
import { fetchGoogleNews } from '../src/news-service.js';
import { renderDirectList, InteractiveNewsCLI } from '../src/cli-renderer.js';
import { getTopicByCode } from '../src/topics.js';

const program = new Command();

program
  .name('google-news')
  .description('A premium CLI to fetch and read the latest news from Google News')
  .version('1.0.0')
  .option('-s, --search <query>', 'Search news for a specific keyword')
  .option('-t, --topic <topic-name>', 'Fetch news for a specific topic (e.g. technology, business, world)')
  .option('-l, --limit <count>', 'Number of articles to fetch', (val) => parseInt(val, 10), 10)
  .option('-c, --country <country-code>', 'Two-letter country code (e.g. US, GB, BR)', 'US')
  .option('-g, --language <lang-code>', 'Two-letter language code (e.g. en, es, fr)', 'en')
  .option('-i, --interactive', 'Force interactive mode');

program.parse(process.argv);

const options = program.opts();

async function main() {
  // If the user forces interactive mode, or did not specify search/topic, we go interactive.
  // Note: if the user specifies only limit, country, or language, we can still run direct mode.
  // We determine direct mode if the user provided --search or --topic.
  const hasSearch = typeof options.search === 'string' && options.search.trim().length > 0;
  const hasTopic = typeof options.topic === 'string' && options.topic.trim().length > 0;
  const forceInteractive = !!options.interactive;

  if (forceInteractive || (!hasSearch && !hasTopic)) {
    // Run Interactive CLI
    const interactiveCLI = new InteractiveNewsCLI();
    
    // Pass along command line settings as initial state
    interactiveCLI.language = options.language.toLowerCase();
    interactiveCLI.country = options.country.toUpperCase();
    interactiveCLI.limit = options.limit;
    
    await interactiveCLI.start();
  } else {
    // Run Direct Mode
    const fetchOptions = {
      language: options.language,
      country: options.country,
      limit: options.limit
    };

    if (hasSearch) {
      fetchOptions.search = options.search;
    } else if (hasTopic) {
      const topicObj = getTopicByCode(options.topic);
      if (!topicObj) {
        console.error(pc.red(`\n  Error: Invalid topic "${options.topic}".`));
        console.error(pc.yellow(`  Available topics: world, nation, business, technology, entertainment, sports, science, health\n`));
        process.exit(1);
      }
      fetchOptions.topic = topicObj.code;
    }

    const spinner = ora({
      text: 'Connecting to Google News...',
      color: 'cyan'
    }).start();

    try {
      const feed = await fetchGoogleNews(fetchOptions);
      spinner.stop();
      renderDirectList(feed, fetchOptions.language, fetchOptions.country);
    } catch (err) {
      spinner.fail('Failed to fetch news');
      console.error(pc.red(`\n  Error details: ${err.message}\n`));
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error(pc.red(`\n  Fatal Error: ${err.message}`));
  process.exit(1);
});
