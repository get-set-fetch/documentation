---
title: Storage
order: 20
---
Each scraped URL (web page, image, API endpoint, ...) represents a `Resource`. Binary content is stored under `resource.data` while text based content is stored under `resource.content`. Resources sharing the same project configuration and discovered from the same initial URL(s) are grouped in a `Project`. 

Projects represent the starting point for any scraping operation. Each project has its own `Queue` and `Resource` collections with their own storage options. This means you can use one storage type for managing the queue and a different one for storing the scraped resources. To be scraped URLs are first added to `Queue`, successfully scraped content is saved under `Resource`.

You can add additional storage support by extending the `Connection` abstract class and implementing a subset of the `IProjectStorage`, `IQueueStorage`, `IResourceStorage` interfaces. \\
Currently supported databases - Sqlite, MySQL, PostgreSQL - are accessed using `KnexConnection`.

Check below connection examples for possible values of `connConfig`.

```js
const { KnexConnection } = require('@get-set-fetch/scraper');
const conn = new KnexConnection(connConfig);
```

### SQLite
Default storage option if none provided consuming the least amount of resources. Requires knex and sqlite driver.
```
$ npm install knex sqlite3
```
SQLite connection example.
```json
{
  "client": "sqlite3",
  "useNullAsDefault": true,
  "connection": {
    "filename": "gsf.sqlite"
  },
  "debug": false
}
```

### MySQL
Requires knex and mysql driver.
```
$ npm install knex mysql
```
MySQL connection example.
```json
{
  "client": "mysql",
  "useNullAsDefault": true,
  "connection": {
    "host": "localhost",
    "port": "33060",
    "user": "gsf-user",
    "password": "gsf-pswd",
    "database": "gsf-db"
  },
  "debug": false
}
```

### PostgreSQL
Requires knex and postgresql driver.
```
$ npm install knex pg
```
PostgreSQL connection example.
```json
{
  "client": "pg",
  "useNullAsDefault": true,
  "connection": {
    "host": "localhost",
    "port": "54320",
    "user": "gsf-user",
    "password": "gsf-pswd",
    "database": "gsf-db"
  },
  "debug": false
}
```
