---
title: Custom Typescript / Javascript Plugins
menu_title: Custom Plugins
order: 100
---
At minimum a plugin needs to define two functions: `test` and `apply`. The former checks if the plugin should be invoked, the latter invokes it. Both functions can be executed in either nodejs or browser environments.

A plugin is executed in browser if it defines a `domRead` or `domWrite` option set to `true`. When registering such a plugin via `PluginStore.addEntry` a bundle is created containing all its dependencies, including node_modules ones. Try to have such dependencies in ECMAScript module format as this enables tree shaking keeping the bundle size to a minimum. Other module formats like CommonJS are non-deterministic at build time severely limiting tree shaking capabilities. The entire module may be added to the plugin bundle even though you're only using a part of it. Importing typescript plugins via command line is not supported.

```js
import { Readability } from '@mozilla/readability';

export default class ReadabilityPlugin {
  opts = {
    domRead: true,
  }

  test(project, resource) {
    if (!resource) return false;
    return (/html/i).test(resource.contentType);
  }

  apply() {
    const article = new Readability(document).parse();
    return { content: [ [ article.excerpt ] ] };
  }
}
```
The above plugin checks if a web resource is already loaded and is of html type. If these test conditions are met, it extracts a page excerpt using `@mozilla/readability` library. It runs in browser due to its `domRead` option set to `true`. `content` is a predefined property at [Resource](storage.html) level with a `string[][]` type. Think of it as data rows with each row containing one or multiple entries. When extracting excerpts from a web page, there is only one row and it contains a single excerpt element.

Prior to scraping the plugin needs to be registered.
```js
await PluginStore.init();
await PluginStore.addEntry(join(__dirname, 'ReadabilityPlugin.js'));
```

With the help of this plugin one can extract article excerpts from news sites such as [BBC technology section](https://www.bbc.com/news/technology){:target="_blank"}. Custom `ReadabilityPlugin` replaces builtin [ExtractHtmlContentPlugin](plugins.html#extract-html-content-plugin). Only links containing hrefs starting with `/news/technology-` are followed. Scraping is limited to 5 articles. [See full script.](https://github.com/get-set-fetch/scraper/blob/main/examples/article-excerpts/article-excerpts.ts)
```js
const projectOpts = {
  name: 'bbcNews',
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ExtractUrlsPlugin',
      maxDepth: 1,
      selectorPairs: [
        { urlSelector: "a[href ^= '/news/technology-']" },
      ],
    },
    {
      name: 'ReadabilityPlugin',
      replace: 'ExtractHtmlContentPlugin',
      domRead: true,
    },
    {
      name: 'InsertResourcesPlugin',
      maxResources: 5,
    },
  ],
  resources: [
    {
      url: 'https://www.bbc.com/news/technology'
    }
  ]
};
```