---
title: Scraping Pipelines - Load Web Pages, Extract New URLs, Extract Content, Save to Database
menu_title: Pipelines
order: 40
---
Each pipeline contains a series of plugins with predefined values for all plugin options. A project configuration extends a pipeline by replacing/adding new plugins or overriding the predefined plugin options.

Take a look at [Examples](examples.html) for real world project configurations.

### Base Pipeline: Static Content 
Used to scrape static data, does not rely on javascript to either read or alter the html content. 

Comes in two variants [browser-static-content](#pipeline-browser-static-content), [dom-static-content](#pipeline-dom-static-content). First one runs in browser, second one makes use of a dom-like parsing library such as cheerio.

### Pipeline: Browser-Static-Content
Sequentially executed plugins.
- [BrowserFetchPlugin](./plugins.html#browser-fetch-plugin)
  - `gotoOptions.timeout`: 30000
  - `gotoOptions.waitUntil`: domcontentloaded
  - `stabilityCheck`: 0
  - `stabilityTimeout`: 0
- [ExtractUrlsPlugin](./plugins.html#extract-urls-plugin)
  - `domRead`: true
  - `maxDepth`: -1
  - `selectorPairs`:  [ { urlSelector: 'a[href$=".html"]' } ]
- [ExtractHtmlContentPlugin](./plugins.html#extract-html-content-plugin)
  - `domRead`: true
  - `selectorPairs`:  []
- [InsertResourcesPlugin](./plugins.html#insert-resources-plugin)
  - `maxResources`: -1
- [UpsertResourcePlugin](./plugins.html#upsert-resource-plugin)
  - `keepHtmlData`: false

### Pipeline: Dom-Static-Content
Sequentially executed plugins.
- [NodeFetchPlugin](./plugins.html#node-fetch-plugin)
  - `headers`: { 'Accept-Encoding': 'br,gzip,deflate' }
- [ExtractUrlsPlugin](./plugins.html#extract-urls-plugin)
  - `domRead`: false
  - `maxDepth`: -1
  - `selectorPairs`:  [ { urlSelector: 'a[href$=".html"]' } ]
- [ExtractHtmlContentPlugin](./plugins.html#extract-html-content-plugin)
  - `domRead`: false
  - `selectorPairs`:  []
- [InsertResourcesPlugin](./plugins.html#insert-resources-plugin)
  - `maxResources`: -1
- [UpsertResourcePlugin](./plugins.html#upsert-resource-plugin)
  - `keepHtmlData`: false

### Static Content Examples

Limit scraping to a single page by setting `ExtractUrlsPlugin.maxDepth` to `0`.
```js
scraper.scrape({
  name: "singlePageScraping",
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ExtractUrlsPlugin',
      maxDepth: 0,
    }
  ],
  resources: [
    {
      url: 'startUrl'
    }
  ]
})
```

Scrape from each html page all elements found by the `h1.title` CSS selector.
```js
scraper.scrape({
  name: 'h1TitleScraping',
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ExtractHtmlContentPlugin',
      selectorPairs: [
        {
          contentSelector: 'h1.title',
          label: 'main title',
        },
      ]
    }
  ],
  resources: [
    {
      url: 'startUrl'
    }
  ]
})
```

Add a new `ScrollPlugin` to the pipeline and scroll html pages to reveal further dynamically loaded content.
```js
scraper.scrape({
  name: 'scrollScraping',
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ScrollPlugin',
      after: 'UpsertResourcePlugin',
      stabilityCheck: 1000,
    }
  ],
  resources: [
    {
      url: 'startUrl'
    }
  ]
})
```

Replace `ExtractHtmlContentPlugin` with an external plugin. `path` is relative to current working directory / config file directory when invoked from a module / cli.
```js
scraper.scrape({
  name: 'customScraping',
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'H1CounterPlugin',
      path: "../plugins/h1-counter-plugin.js",
      replace: 'ExtractHtmlContentPlugin',
      customOptionA: 1000,
      customOptionB: 'h1',
    }
  ],
  resources: [
    {
      url: 'startUrl'
    }
  ]
})
```