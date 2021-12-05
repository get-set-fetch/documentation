---
title: Scrape
order: 60
---
### Start from a project configuration
No need to specify a project instance. One will be automatically created based on the provided project options.
```js
const { KnexConnection, PuppeteerClient, Scraper} = require('@get-set-fetch/scraper');

const conn = new KnexConnection();
const client = new PuppeteerClient();
const scraper = new Scraper(conn, client);

scraper.scrape({
  name: 'language-list',
  pipeline: 'browser-static-content',
  pluginOpts: [
    {
      name: 'ExtractUrlsPlugin',
      maxDepth: 0,
    },
    {
      name: 'ExtractHtmlContentPlugin',
      selectorPairs: [
        {
          contentSelector: 'table.metadata + p + table.wikitable td:nth-child(2) > a:first-child',
          label: 'language',
        },
        {
          contentSelector: 'table.metadata + p + table.wikitable td:nth-child(3)',
          label: 'speakers (milions)',
        },
      ],
    },
  ],
  resources: [
    {
      url: 'https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers'
    }
  ]
});
```

### Start from a project hash
A project hash represents a zlib archive of a project configuration encoded as base64. To minimize size a preset deflate dictionary is used.

```js
const { KnexConnection, PuppeteerClient, Scraper, encode, decode } = require('@get-set-fetch/scraper');

const conn = new KnexConnection();
const client = new PuppeteerClient();
const scraper = new Scraper(conn, client);

const projectHash = 'ePnXQdMJrZNNDoMgEIWvQrqSNNWm3bnoCXoHMpYRiYBGsE1v30FDf+JCF12QwFu8N5n38TYz4NQICq/ahy2EruH4Q8Kn0OOSmW3gLmml7gzmFgNICMD2rKcziw/d6unGgixdaA63RhuZnTi7MChr8gyzRFHpR6QF7OKE/0g78y933yO0hA7LLAFHXfK4/pWu0E3ePUoNeTeoIr6K2JDoapEG9qJ6CjfaCocoO2rpjiIFxpgXe3Oswg==';

// outputs the project options from the above "Start from Project Options" section
// use encode to generate a project hash
console.log(decode(projectHash));

scraper.scrape(projectHash);
```

### Start from a predefined project
A new project is defined with plugin options overriding default ones from the [browser-static-content](pipelines.html#pipeline-browser-static-content) pipeline.

```js
const { 
  ConnectionManager, KnexConnection, pipelines, mergePluginOpts, PuppeteerClient, Scraper 
} = require('@get-set-fetch/scraper');

const connMng = new ConnectionManager(new KnexConnection());
await connMng.connect();
Project = await connMng.getProject();

const project = new Project({
  name: 'projA.com',

  pluginOpts: mergePluginOpts(
    pipelines['browser-static-content'].defaultPluginOpts,
    [
      {
        name: 'ExtractUrlsPlugin',
        maxDepth: 0,
      },
      {
        name: 'MyCustomPlugin',
        before: 'UpsertResourcePlugin',
        optA: 'valA',
      }
    ]
  ),
});
await project.save();
await project.batchInsertResources([
  { url: 'http://projA.com' }
]);

const client = new PuppeteerClient();

const scraper = new Scraper(storage, client);
scraper.scrape(project);
```

You can add additional resources to a project via `batchInsertResources(resources, chunkSize)`. Each entry contains an URL and an optional depth. If depth is not specified the resource will be linked to the project with depth 0. By default, every 1000 resources are wrapped inside a transaction.
```js
await project.batchInsertResources(
  [
    {url: 'http://sitea.com/page1.html'},
    {url: 'http://sitea.com/page2.html', depth: 1}
  ],
  2000
);
```
The above performs URI normalization and creates a wrapping transaction every 2000 resources.

Additional resources can also be directly loaded from a csv file via `batchInsertResourcesFromFile(resourcePath, chunkSize)`. The column containing the resource url will automatically be detected. Making use of read/write streams, this method keeps memory usage low and is the preferred way of adding 1000k+ entries. `resourcePath` is either absolute or relative to the current working directory. `chunkSize` parameter behaves the same as in `batchInsertResources`.
```js
await project.batchInsertResourcesFromFile(
  './csv/external-resources.csv', 2000
);
```

### Resume scraping
If a project has unscraped resources, just re-start the scrape process. Already scraped resources will be ignored.
You can retrieve an existing project by name or id.

```js
const { ConnectionManager, KnexConnection, PuppeteerClient, Scraper } = require('@get-set-fetch/scraper');

const connMng = new ConnectionManager(new KnexConnection());
await connMng.connect();
Project = await connMng.getProject();

const project = await Project.get('projectName');
const client = new PuppeteerClient();

const scraper = new Scraper(storage, client);
scraper.scrape(project);
```

### Scrape events
List of scrape events with their corresponding callback arguments.
- `ResourceSelected`: (project, resource) \\
a resource is selected to be scraped, its scrapeInProgress flag is set to true
- `ResourceScraped`: (project, resource) \\
a resource is updated with the scraped content, its scrapeInProgress flag is set to false
- `ResourceError`: (project, resource, error) \\
a scraping error linked to a particular resource stops the resource scraping, project scraping continues
- `ProjectSelected`: (project) \\
a project is ready for scraping, storage/browser client/plugins have been initialized
- `ProjectScraped`: (project) \\
all resources linked to the project have been scraped
- `ProjectError`: (project, error) \\
a scraping error not linked to a particular resource stops the scraping process
- `DiscoverComplete` \\
project discovery is complete, all existing projects have all their resources scraped

Scrape event handlers examples.


```js
const { ScrapeEvent } = require('@get-set-fetch/scraper');

scraper.on(ScrapeEvent.ProjectScraped, (project) => {
  console.log(`project ${project.name} has been scraped`);
});

scraper.on(ScrapeEvent.ResourceError, (project, resource, err) => {
  console.log(`error scraping resource ${resource.url} from project ${project.name}: ${err.message}`);
})
```

### Concurrency options
`maxRequests` and `delay` options can be specified at project/proxy/domain/session level. A session is identified as a unique proxy + domain combination. 
All options are optional :) with all combinations valid. The resulting scrape behavior will obey all specified options.
- `proxyPool`
  - list of proxies to be used with each entry a {host, port} object
  - default: `[null]`
- `maxRequests`
  - Maximum number of requests to be run in parallel. Browser clients are restricted to `1`, supporting only sequential scraping. Use [DOM clients](clients.html#dom-clients) for parallel scraping.
  - default: `1`
- `delay`:
  - Minimum amount of time (ms) between starting to scrape two resources.
  - default: `-`/`500`/`1000`/- at project/proxy/domain/session level. Restrictions are set only at proxy/domain level.

```js
const concurrencyOpts = {
  proxyPool: [
    { host: 'proxyA', port: 8080 },
    { host: 'proxyB', port: 8080 }
  ],
  project: {
    maxRequests: 100,
    delay: 100
  },
  proxy: {
    maxRequests: 50,
    delay: 200
  },
  domain: {
    maxRequests: 10,
    delay: 500
  },
  session: {
    maxRequests: 1,
    delay: 3000
  }
}

scraper.scrape(projectOpts, concurrencyOpts);
```
The above concurrency options will use proxyA, proxyB when fetching resources. 

At project level a maximum of 100 resources can be scraped in parallel with a minimum 100 ms between issuing new requests. 

Each proxy can have a maximum of 50 parallel requests with a minimum 200 ms delay before using the same proxy again. 

Each domain to be scraped (independent of the proxy being used) will experience a load of maximum 10 parallel requests with a minimum 0.5 second delay between any two requests.

User sessions defined as unique proxy + domain combinations mimic real user behavior scraping sequentially (maxRequests = 1) every 3 seconds.

### Runtime options
Optional runtime memory and cpu usage constraints defined at OS and process level. If memory or cpu usage is higher than specified new resources will not be scraped until the usage drops. By default there are no constraints.
- `mem`
  - Memory usage (bytes)
- `memPct`
  - Memory usage (percentage)
- `cpuPct`
  - Average cpu usage (percentage)

```js
const runtimeOpts = {
  global: {
    memPct: 75
  },
  process: {
    mem: 1024 * 1024 * 10
  }
}
scraper.scrape(projectOpts, concurrencyOpts, processOpts);
```
The above runtime options will restrict scraper to 10MB process memory usage while also making sure total OS memory usage doesn't exceed 75%.

### Command line options
Additional, command line related flags:
- `overwrite`
  - Overwrite a project if it already exists.
  - default: `false`
- `discover`
  - Don't restrict scraping to a particular project. Once scraping a project completes, find other existing projects to scrape from.
  - default: `false`
- `retry`
  - After a discover operation completes and all projects are scraped, keep issueing discover commands at the specified interval (seconds).

```js
const cliOpts = {
  discover:true,
  retry: 30
}
scraper.scrape(projectOpts, concurrencyOpts, processOpts, cliOpts);
```