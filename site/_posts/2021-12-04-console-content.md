---
title: "Check for browser console errors"
tags: "intermediate"
date: "2021-12-04"
---

Extract console content from a site.\\
Extend the built-in puppeteer client to record console events on each newly opened page.

A browser console log contains all javascript warnings and errors for the current page. It may also contain non-javascript warnings and errors such as missing assets with messages like "Failed to load resource: the server responded with a status of 404 (Not Found)". We're going to scrape console logs from a few wikipedia pages with the final csv exported content looking like:

```
https://en.wikipedia.org/wiki/Main_Page,"warning",
"Error with Permissions-Policy header: Unrecognized feature: 'interest-cohort'."
https://en.wikipedia.org/wiki/Special:MyTalk,"warning",
"This page is using the deprecated ResourceLoader module ""mediawiki.ui"". Please use OOUI instead."
```
[See full script](https://github.com/get-set-fetch/scraper/blob/main/examples/console-content/console-content.ts) and [examples section](/node/examples.html) on how to launch it.

### Puppeteer Client Wrapper
To scrape console content for both javascript and generic messages you need a browser. The scraper can already launch puppeteer using the built-in [PuppeteerClient](/node/clients.html#puppeteer). We're going to extend it to listen for console events. Each console event is stored in `consoleContent`. Prior visiting a new page existing content is removed. In this way `consoleContent` only contains the logs for the current page.
```
export default class ConsolePuppeteerClient extends PuppeteerClient {
  consoleContent: string[][];

  async launch(): Promise<void> {
    await super.launch();

    const consoleHandler = (evt: ConsoleMessage) => {
      this.consoleContent.push([
        evt.type(),
        evt.text(),
      ]);
    };

    this.page.on('console', consoleHandler);
  }

  goto(url: string, opts: WaitForOptions): Promise<HTTPResponse> {
    this.consoleContent = [];
    return super.goto(url, opts);
  }
}
```

### Custom BrowserFetchPlugin
Built-in [BrowserFetchPlugin](/node/plugins.html#browser-fetch-plugin) is responsible for opening each to be scraped URL in a browser tab. It waits for page DOM to stabilize (no new nodes being added, updated or removed) before passing execution to the next plugin. At this point all console events related to rendering the page have been emitted and are available in `client.consoleContent` from the above `ConsolePuppeteerClient` class. Just attach to the returned result the [content](/node/storage.html) property containing the console content.
The result, a partial [Resource](/node/storage.html), is passed to each plugin from the scrape pipeline allowing further modifications. Usually the last plugin saves the content to a database.

When exporting content as csv, the built-in [CsvExporter](/node/export.html#csv-exporter) looks through all pipeline plugins to figure out the csv column names. `getContentKeys` provides this info.

```
export default class ConsoleBrowserFetchPlugin extends BrowserFetchPlugin {
  getContentKeys() {
    return [ 'type', 'text' ];
  }

  async openInTab(resource: Resource, client: ConsolePuppeteerClient): Promise<Partial<Resource>> {
    const result: Partial<Resource> = await super.openInTab(resource, client);
    result.content = client.consoleContent;
    return result;
  }
}
```

### Scrape Configuration
The scrape configuration is based on the built-in [browser-static-content](/node/pipelines.html#pipeline-browser-static-content) pipeline. Since this is just an example, we restrict the number of scraped resources to 5 via the [InsertResourcesPlugin](/node/plugins.html#insert-resources-plugin) `maxResources` option.
```
 "project": {
        "name": "ConsoleContent",
        "pipeline": "browser-static-content",
        "pluginOpts": [
            {
                "name": "ConsoleBrowserFetchPlugin",
                "path": "ConsoleBrowserFetchPlugin.ts",
                "replace": "BrowserFetchPlugin"
            },
            {
                "name": "InsertResourcesPlugin",
                "maxResources": 5
            }
        ],
        "resources": [
            {
                "url": "https://en.wikipedia.org/wiki/Main_Page"
            }
        ]
    }
```

### Start Scraping
Putting it all together:
```ts
import { Scraper, ScrapeEvent, Project, CsvExporter, BrowserClient } from '@get-set-fetch/scraper';

import ScrapeConfig from './console-content-config.json';
import ConsolePuppeteerClient from './ConsolePuppeteerClient';

const browserClient: BrowserClient = new ConsolePuppeteerClient();
const scraper = new Scraper(ScrapeConfig.storage, browserClient);

scraper.on(ScrapeEvent.ProjectScraped, async (project: Project) => {
  const exporter = new CsvExporter({ filepath: 'console.csv' });
  await exporter.export(project);
});

scraper.scrape(ScrapeConfig.project, ScrapeConfig.concurrency);
```


