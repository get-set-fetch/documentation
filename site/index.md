---
title: Get-Set, Fetch! Nodejs Web Scraper
menu_title: Getting Started
order: 10
node: true
---
[@get-set-fetch/scraper](https://github.com/get-set-fetch/scraper) is a plugin based, batteries included, open source nodejs web scraper. It scrapes, stores and exports data. 
An ordered list of plugins (default or custom defined) is executed against each to be scraped web resource.

Supports multiple storage options: SQLite, MySQL, PostgreSQL.
Supports multiple browser or dom-like clients: Puppeteer, Playwright, Cheerio, JSdom. 

You can use it in your own javascript/typescript code, from the [command line](node/command-line.html), with [docker](node/docker.html) or in [cloud](node/cloud.html).

![](/assets/img/cli-demo.svg)

### Install the scraper
```
$ npm install @get-set-fetch/scraper
```

### Install a storage solution
```
$ npm install knex sqlite3
```
Supported storage options are defined as peer dependencies. You need to install at least one of them. Currently available: SQLite, MySQL, PostgreSQL. All of them require Knex.js query builder to be installed as well.

### Install a browser client
```
$ npm install puppeteer
```
Supported browser clients are defined as peer dependencies. Supported browser clients: Puppeteer, Playwright. Supported DOM clients: Cheerio, JSDom.

### Init storage
```js
const { KnexConnection } = require('@get-set-fetch/scraper');
const connConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: ':memory:'
  }
}
const conn = new KnexConnection(connConfig);
```
See [Storage](node/storage.html) on full configurations for supported SQLite, MySQL, PostgreSQL.

### Init browser client
```js
const { PuppeteerClient } = require('@get-set-fetch/scraper');
const launchOpts = {
  headless: true,
}
const client = new PuppeteerClient(launchOpts);
```

### Init scraper
```js
const { Scraper } = require('@get-set-fetch/scraper');
const scraper = new Scraper(conn, client);
```

### Define a project
```js
const projectOpts = {
  name: "myScrapeProject",
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ExtractUrlsPlugin',
      maxDepth: 3,
      selectorPairs: [
        {
          urlSelector: '#searchResults ~ .pagination > a.ChoosePage:nth-child(2)',
        },
        {
          urlSelector: 'h3.booktitle a.results',
        },
        {
          urlSelector: 'a.coverLook > img.cover',
        },
      ],
    },
    {
      name: 'ExtractHtmlContentPlugin',
      selectorPairs: [
        {
          contentSelector: 'h1.work-title',
          label: 'title',
        },
        {
          contentSelector: 'h2.edition-byline a',
          label: 'author',
        },
        {
          contentSelector: 'ul.readers-stats > li.avg-ratings > span[itemProp="ratingValue"]',
          label: 'rating value',
        },
        {
          contentSelector: 'ul.readers-stats > li > span[itemProp="reviewCount"]',
          label: 'review count',
        },
      ],
    },
  ],
  resources: [
    {
      url: 'https://openlibrary.org/authors/OL34221A/Isaac_Asimov?page=1'
    }
  ]
};
```
You can define a project in multiple ways. The above example is the most direct one.
You define one or more starting urls, a predefined pipeline containing a series of scrape plugins with default options, and any plugin options you want to override. See [pipelines](node/pipelines.html) and [plugins](node/plugins.html) for all available options.

ExtractUrlsPlugin.maxDepth defines a maximum depth of resources to be scraped. The starting resource has depth 0. Resources discovered from it have depth 1 and so on. A value of -1 disables this check.

ExtractUrlsPlugin.selectorPairs defines CSS selectors for discovering new resources. urlSelector property selects the links while the optional titleSelector can be used for renaming binary resources like images or pdfs. In order, the define selectorPairs extract pagination URLs, book detail URLs, image cover URLs.

ExtractHtmlContentPlugin.selectorPairs scrapes content via CSS selectors. Optional labels can be used for specifying columns when exporting results as csv.

### Define concurrency options
```js
const concurrencyOpts = {
  project: {
    delay: 1000
  }
  domain: {
    delay: 5000
  }
}
```
A minimum delay of 5000 ms will be enforced between scraping consecutive resources from the same domain. At project level, across all domains, any two resources will be scraped with a minimum 1000 ms delay between requests. See [concurrency options](node/scrape.html#concurrency-options) for all available options.

### Start scraping
```js
scraper.scrape(projectOpts, concurrencyOpts);
```
The entire process is asynchronous. Listen to the emitted [scrape events](node/scrape.html#scrape-events) to monitor progress.

### Export results
```js
const { ScrapeEvent, CsvExporter, ZipExporter } = require('@get-set-fetch/scraper');

scraper.on(ScrapeEvent.ProjectScraped, async (project) => {
  const csvExporter = new CsvExporter({ filepath: 'books.csv' });
  await csvExporter.export(project);

  const zipExporter = new ZipExporter({ filepath: 'book-covers.zip' });
  await zipExporter.export(project);
})
```
Wait for scraping to complete by listening to `ProjectScraped` event.

Export scraped html content as csv. Export scraped images under a zip archive. See [Export](node/export.html) for all supported parameters.
