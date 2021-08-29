---
title: Clients
order: 30
---
## Browser Clients
Clients controlling an actual browser. You can use such clients with predefined pipelines prefixed by 'browser' like [browser-static-content](pipelines.html#pipeline-browser-static-content). Each client needs to be manually installed as @get-set-fetch/scraper is not bundling them. 

If not specified, a default `headless:true` flag is added to the `launchOpts`.

### Puppeteer
```
$ npm install puppeteer
```

```js
const { Scraper, PuppeteerClient } = require('@get-set-fetch/scraper');
// assumes launchOpts, storage are already defined
const client = new PuppeteerClient(launchOpts);
const scraper = new Scraper(storage, client);
```

### Playwright
```
$ npm install playwright-core playwright-chromium
```
The above installs playwright for Chromium. If targeting Webkit or Firefox keep `playwright-core` and either install `playwright-webkit` or `playwright-firefox`.

```js
const { Scraper, PlaywrightClient } = require('@get-set-fetch/scraper');
// assumes launchOpts, storage are already defined
const client = new PlaywrightClient(launchOpts);
const scraper = new Scraper(storage, client);
```

## DOM Clients
Clients capable of parsing and querying html content exposing DOM like functionality such as `querySelectorAll`, `getAttribute`.  You can use such clients with predefined pipelines prefixed by 'dom' like [dom-static-content](pipelines.html#pipeline-dom-static-content). Each client needs to be manually installed as @get-set-fetch/scraper is not bundling them.

When defining your own plugins you can directly use your favorite html parsing library, you don't have to use any of the clients described below. They are designed as a compatibility layer between DOM like libraries and browser DOM API so that predefined plugins like [ExtractHtmlContentPlugin](plugins.html#extract-html-content-plugin), [ExtractUrlsPlugin](plugins.html#extract-urls-plugin) can use either one interchangeably. 

For html resources, access to html content is done via `resource.data.toString('utf8')`. Each plugin is called with a `resource` argument, see [Custom Plugins](custom-plugins.html) for further info.

### Cheerio
```
$ npm install cheerio
```

```js
const { Scraper, CheerioClient } = require('@get-set-fetch/scraper');
// assumes storage is already defined
const scraper = new Scraper(storage, CheerioClient);
```

### Jsdom
```
$ npm install jsdom
```

```js
const { Scraper, JsdomClient } = require('@get-set-fetch/scraper');
// assumes storage is already defined
const scraper = new Scraper(storage, JsdomClient);
```