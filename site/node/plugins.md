---
title: Typescript / Javascript Scraping Plugins
menu_title: Plugins
order: 50
---
## PluginStore 
Prior to scraping, available plugins are registered into a plugin store via their filepaths. Each plugin is a javascript module with a default export declaration containing a class extending `Plugin`. Class `constructor.name` is used to uniquely identify a plugin. Each plugin together with its dependencies is bundled as a single module to be run either in a browser or nodejs environment.

Specifying a filePath will register a single plugin. Specifying a dirPath will register all plugins stored under that directory. Paths are absolute.
```js
await PluginStore.add(fileOrDirPath);
```

## Plugins

The entire scrape process is plugin based. A project configuration (see [Examples](examples.html)) contains an ordered list of plugins to be executed against each to be scraped web resource. Each plugin embeds a json schema for its options. Check the schemas for complete option definitions.

### Node Fetch Plugin
Uses nodejs `http.request` / `https.request` to fetch html and binary data. Response content is available under Uint8Array `resource.data`.  Html content can be retrieved via `resource.data.toString('utf8')`.
- `headers`
  - Request headers.
  - default: `{ 'Accept-Encoding': 'br,gzip,deflate' }`

### Browser Fetch Plugin
Depending on resource type (binary, html), either downloads or opens in the scrape tab the resource URL.
- `gotoOptions`
  - navigation parameters for Puppeteer/Playwright page.goto API.
  - `timeout`
    - maximum navigation time in milliseconds
    - default: `30000`
  - `waitUntil`
    - when to consider navigation succeeded
    - default: `domcontentloaded`
- `stabilityCheck`
  - Considers the page loaded and ready to be scraped when there are no more DOM changes within the specified amount of time (milliseconds). Only applies to html resources. Useful for bypassing preloader content.
  - default: `0`
- `stabilityTimeout`
  - Maximum waiting time (milliseconds) for achieving DOM stability in case of a continuously updated DOM (ex: timers, countdowns).
  - default: `0`

### Extract Urls Plugin
Extracts new (html or binary) resource URLs using CSS selectors.
- `domRead`
  - Whether or not the plugin runs in browser DOM or makes use of a DOM-like parsing library like cheerio
  - default: `true`
- `maxDepth`
  - Maximum depth of resources to be scraped. The starting resource has depth 0. Resources discovered from it have depth 1 and so on. A value of -1 disables this check.
  - default: `-1`
- `selectorPairs`
  - Array of CSS selectors to be applied. Each entry is a `{ urlSelector, titleSelector }` object. titleSelector is optional and it is used for prefixing the generated filename when the urlSelector points to a binary resource.
  - default: `[ { urlSelector: 'a[href$=".html"]' } ]`

### Extract Html Content Plugin
Scrapes html content using CSS selectors.
- `domRead`
  - Whether or not the plugin runs in browser DOM or makes use of a DOM-like parsing library like cheerio
  - default: `true`
- `selectorPairs`
  - Array of CSS selectors to be applied. Each entry is a `{ contentSelector, contentProperty, label }` object. contentSelector: selects DOM elements while contentProperty specifies the DOM element property that holds the value to be scraped defaulting to `innerText`. label is used as column name when exporting as csv.

### Insert Resources Plugin
Saves new resources within the current project based on newly identified URLs.
- `maxResources`
  - Maximum number of resources to be saved and scraped. A value of -1 disables this check.
  - default: `-1`

### Upsert Resource Plugin
Updates a static resource or inserts a dynamic one after being scraped by previous plugins.
- `keepHtmlData`
  - Whether or not to save html buffer response (if present) under resource.data
  - default: `false`

### Scroll Plugin
Performs infinite scrolling in order to load additional content.
- `delay`
  - Delay (milliseconds) between performing two consecutive scroll operations.
  - default: `1000`
- `maxActions`
  - Number of maximum scroll actions. A value of -1 scrolls till no new content is added to the page.
  - default: `-1`
- `stabilityCheck`
  - Considers the page loaded and ready to be scraped when there are no more DOM changes within the specified amount of time (milliseconds). Useful for bypassing preloader content.
  - default: `1000`
- `stabilityTimeout`
  - Maximum waiting time (milliseconds) for achieving DOM stability in case of a continuously updated DOM (ex: timers, countdowns).
  - default: `3000`