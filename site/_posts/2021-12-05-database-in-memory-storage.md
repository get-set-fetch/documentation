---
title: "Combine database with in-memory storage"
tags: "advanced"
date: "2021-12-05"
---

In-memory scrape queue. Store scraped content in a database.\\
Explore the ways you can combine multiple storage options to scrape a project.

Most examples in the documentation use a scrape configuration with a single storage option for [all three main collections](/node/storage.html): Project, Queue, Resource. But the scraper can use a different storage for each one!

This makes possible some interesting, distributed scraping scenarios. Store all project data (config, plugins, starting URLs) in PostgreSQL. Scrape each project with its own scraper instance on a different docker container or cloud instance. Since a project is only scraped by a single scraper instance switch the Queue collection from database to in-memory. Store the scraped content in the initial PostgreSQL or any other medium, provided you've implemented a subset of `IProjectStorage`, `IQueueStorage`, `IResourceStorage` as shown below.

What follows is an in-memory implementation of Queue collection storage.\\
[See full script](https://github.com/get-set-fetch/scraper/blob/main/examples/in-memory-queue/in-memory-queue.ts) and [examples section](/node/examples.html) on how to launch it.

### In-Memory Queue

Since there are no database tables or collections involved, `init`, `add`, `drop` just construct, update and delete respectively a regular javascript Map with URLs as keys. `getResourcesToScrape` returns not yet scraped queue entries and sets their status to a value of 1 (scrape in progress).

```
export default class InMemoryQueue extends Storage implements IQueueStorage {
  queue:Map<string, QueueEntry>;

  async init() {
    this.queue = new Map();
  }

  async add(entries: QueueEntry[]) {
    entries.forEach(entry => {
      if (!this.queue.has(entry.url)) {
        this.queue.set(entry.url, { ...entry, id: entry.url });
      }
    });
  }

  async getResourcesToScrape(limit:number = 10) {
    const queueEntries:QueueEntry[] = [];

    const queueIt = this.queue.values();
    let result: IteratorResult<QueueEntry> = queueIt.next();

    while (queueEntries.length < limit && !result.done) {
      const queueEntry:QueueEntry = result.value;

      if (queueEntry.status === undefined) {
        queueEntry.status = 1;
        queueEntries.push(queueEntry);
      }

      result = queueIt.next();
    }

    return queueEntries;
  }

  // a few other functions targeting this.queue: count, getAll, updateStatus

  async drop() {
    delete this.queue;
  }
}
```

### In-Memory Connection

A `ConnectionManager` instance is responsible for opening and closing connections to each storage medium. Each such `Connection` provides access to `Project`, `Queue`, `Resource` collections via `getProjectStorage`, `getQueueStorage`, `getResourceStorage`, respectively.

The scraping process starts by retrieving an ORM-style `typeof Project` class using `connectionManager.getProject()`. 

`InMemoryConnection` only provides access to Queue storage and throws errors on `Project` and `Resource` access. By default each connection type is established based on an input configuration; there are no settings for the implemented in-memory storage so the constructor just specifies an arbitrary `client` value. Since there's nothing to connect to `open` and `close` functions are empty.

```
export default class InMemoryConnection extends Connection {
  constructor() {
    super({ client: 'in-memory' });
  }

  async open() {}
  async close() {}

  getProjectStorage():IProjectStorage {
    throw new Error('In-Memory Project not supported');
  }

  getResourceStorage():IResourceStorage {
    throw new Error('In-Memory Resource not supported');
  }

  getQueueStorage():IQueueStorage {
    return new InMemoryQueue(this);
  }
}
```

### Start Scraping
The imported `ScrapeConfig` uses SQLite storage for all three collections: `Project`, `Queue`, `Resource`.\\
We override this by individually setting the storage options per collection and directly setting `Queue` to the above `InMemoryConnection`.

Putting it all together:
```ts
import { Scraper, ScrapeEvent, Project, CsvExporter } from '@get-set-fetch/scraper';

import ScrapeConfig from './in-memory-queue-config.json';
import InMemoryConnection from './InMemoryConnection';

const conn = {
  Project: ScrapeConfig.storage,
  Queue: new InMemoryConnection(),
  Resource: ScrapeConfig.storage,
};
const scraper = new Scraper(conn, ScrapeConfig.client);

scraper.on(ScrapeEvent.ProjectScraped, async (project: Project) => {
  const exporter = new CsvExporter({ filepath: 'in-memory-queue.csv' });
  await exporter.export(project);
});

scraper.scrape(ScrapeConfig.project, ScrapeConfig.concurrency);
```

