---
title: "How to Generate a Sitemap"
tags: "beginner"
date: "2021-09-27"
---

Follow and extract all html links from a site.  
Override default plugins and use a custom exporter to generate the sitemap based on the scraped URLs. 

A sitemap is just an XML file with a parent `<urlset>` tag containing `<url>` entries. At minimum each `<url>` tag contains a `<loc>` entry corresponding to the page URL. We're going to generate the getsetfetch.org sitemap looking like this:
```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://www.getsetfetch.org/index.html</loc></url>
....
</urlset>
```
[See full script](https://github.com/get-set-fetch/scraper/blob/main/examples/sitemap/sitemap.ts) and [examples section](/node/examples.html) on how to launch it.


### Scrape Configuration
Starting from an initial URL we need to parse, extract and visit all identified URLs from the same domain. We don't need a browser for this, a [DOM client](/node/clients#dom-clients) like cheerio will do.
```js
"client": {
    "name": "cheerio"
}
```

In @get-set-fetch/scraper each url represents a resource. Depending on the selected [pipeline](/node/pipelines.html) a series of plugins is executed against each resource. 

[ExtractUrlsPlugin](/node/plugins#extract-urls-plugin) is responsible for parsing html resources and extracting new URLs to be scraped. By default it only extracts URLs from html links ending in `.html` due to `urlSelector` default value of `a[href$=".html"]`.
This obviously is not enough; html documents may have extensions different than `.html` or no extension at all. Follow all links using the generic selector `a`. This will also include external links outside the sitemap domain. We need to filter these ones out by extending the default plugin class and overriding `isValidUrl` method. Only URLs from the getsetfetch.org domain will be extracted. `ExtractUrlsPlugin` is a plugin that can run in both browser and nodejs environment depending on the `domRead`, `domWrite` flags. Disable such inherited flags for the custom plugin since it's not going to run in browser.
```ts
export default class ExtractSameHostUrlsPlugin extends ExtractUrlsPlugin {
  constructor(opts:Partial<PluginOpts> = {}) {
    super(opts);
    this.opts.domRead = false;
  }

  isValidUrl(url: URL) {
    return url.hostname === 'www.getsetfetch.org';
  }
}
```

Since we're not interested in extracting content, we can replace the default [ExtractHtmlContentPlugin](/node/plugins#extract-html-content-plugin) with a plugin that never triggers, always returning `false` from the `test` method.
```ts
export default class SkipExtractHtmlContentPlugin extends Plugin {
  test() {
    return false;
  }

  apply() {}
}
```

Refer the custom plugins in the project options:
```ts
"project": {
  "name": "sitemap",
  "resources": [
    {
      "url": "https://www.getsetfetch.org/index.html"
    }
  ],
  "pipeline": "dom-static-content",
  "pluginOpts": [
    {
      "name": "ExtractSameHostUrlsPlugin",
      "path": "ExtractSameHostUrlsPlugin.ts",
      "replace": "ExtractUrlsPlugin"
    },
    {
      "name": "SkipExtractHtmlContentPlugin",
      "path": "SkipExtractHtmlContentPlugin.ts",
      "replace": "ExtractHtmlContentPlugin"
    }
  ]
}
```

No rush :). Go easy on the site you're scraping. You can always stop and resume the scraping process since results are stored in a database. At session level restrict the maximum number of parallel requests to 1 with a 3 second delay between them. This transforms the scraping process from parallel to sequential. See [concurrency options](/node/scrape.html#concurrency-options) for more details. Monitor progress by checking the generated `scrape.log` file.
```ts
"concurrency": {
    "session": {
        "maxRequests": 1,
        "delay": 3000
    }
}
```

Here's the [full scrape configuration](https://github.com/get-set-fetch/scraper/blob/main/examples/sitemap/scrape-config.json).

### Custom Sitemap Exporter

Now that the scrape configuration is done, we can focus on the custom exporter responsible for generating the sitemap based on the scraped resources. At resource level [getResourceQuery](/node/export.html#custom-exporter) defines what database columns to be retrieved together with some filtering criteria. The sitemap is only generated for html resources having `contentType` set to `text/html`. A fs.writeStream is used to write the sitemap XML file to disk.
```ts
export default class SitemapExporter extends Exporter {
  logger = getLogger('SitemapExporter');

  wstream: fs.WriteStream;

  getResourceQuery() {
    return { cols: [ 'url' ], where: { contentType: 'text/html' } };
  }

  async preParse() {
    this.wstream = fs.createWriteStream(this.opts.filepath);
    this.wstream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    this.wstream.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
  }

  async parse(resource: Partial<Resource>) {
    this.wstream.write(`<url><loc>${resource.url}</loc></url>\n`);
  }

  async postParse() {
    this.wstream.write('</urlset>');
    this.wstream.close();
  }
}
```

### Start scraping
Putting it all together:
```ts
import { Scraper, ScrapeEvent, Project } from '@get-set-fetch/scraper';

import ScrapeConfig from './scrape-config.json';
import SitemapExporter from './SitemapExporter';

const scraper = new Scraper(ScrapeConfig.storage, ScrapeConfig.client);

scraper.on(ScrapeEvent.ProjectScraped, async (project: Project) => {
  const exporter = new SitemapExporter({ filepath: 'sitemap.xml' });
  await exporter.export(project);
});

scraper.scrape(ScrapeConfig.project, ScrapeConfig.concurrency);
```

