# 📰 Google News CLI

A premium, interactive command-line application built in Node.js to fetch, search, and browse the latest news from Google News.

Featuring a beautiful interactive terminal reader, smart date formatting, custom search capabilities, topic-based feeds, and multi-region localization support.

---

## Features

- **Interactive Terminal Browser**: A clean interactive shell built with arrow key navigation, lists, sub-menus, detail views, and browser linking.
- **Search Queries**: Search for real-time news about any key phrase (e.g. `google-news --search "Quantum Computing"`).
- **Topics Mode**: Fetch general categories like `technology`, `science`, `business`, `sports`, `world`, etc.
- **Regional & Language Localization**: Fully supports custom locales, e.g. reading French news in France or English news in the UK.
- **Vibrant Styling**: Utilizes `picocolors` and ANSI graphics for clear headings, list structures, metadata highlights, and layout borders.

---

## Installation

### 1. Install Dependencies
Navigate to the project directory and install the packages:
```bash
npm install
```

### 2. Make Executable (optional but recommended)
Link the package globally so you can use the `google-news` command anywhere in your terminal:
```bash
npm link
```
*(Now, you can simply type `google-news` from any directory.)*

---

## Usage

### Interactive Mode (Default)
Simply run the command with no arguments to enter the interactive shell:
```bash
google-news
```
*Alternatively, you can force interactive mode with the `-i` or `--interactive` flag:*
```bash
node bin/index.js -i
```

### Direct CLI Mode
Run specific searches or topics to output headlines directly to the console:

#### 1. Search News
```bash
google-news --search "Google AI" --limit 5
```

#### 2. Browse by Topic
```bash
google-news --topic technology --limit 10
```
Available topics: `world`, `nation`, `business`, `technology`, `entertainment`, `sports`, `science`, `health`.

#### 3. Customize Localization
Fetch the latest French-language news in France:
```bash
google-news --country FR --language fr --limit 5
```

#### 4. Change Limits
Fetch a custom number of articles (default is 10, limit option accepts 1-50):
```bash
google-news --limit 20
```

---

## Command Line Options

```
Options:
  -s, --search <query>          Search news for a specific keyword
  -t, --topic <topic-name>      Fetch news for a specific topic (e.g. technology, business, world)
  -l, --limit <count>           Number of articles to fetch (default: 10)
  -c, --country <country-code>  Two-letter country code (e.g. US, GB, BR) (default: "US")
  -g, --language <lang-code>    Two-letter language code (e.g. en, es, fr) (default: "en")
  -i, --interactive             Force interactive mode
  -h, --help                    display help for command
```

---

## Technical Architecture

The project follows a clean, modular structure using **Node.js ES Modules**:

- `bin/index.js`: Orchestrates command options parsing, handles errors, and selects between interactive or direct mode.
- `src/news-service.js`: Builds URLs with parameters (`hl`, `gl`, `ceid`) and communicates with the Google News RSS endpoints using `rss-parser`. Sanitizes articles and handles title/source isolation.
- `src/cli-renderer.js`: Manages console UI templates, ANSI coloring, spinner status (`ora`), and the main interactive user loop utilizing `prompts`.
- `src/topics.js`: Maps standard topics like Science and Technology to official Google RSS codes.
