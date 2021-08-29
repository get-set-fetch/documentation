---
title: Command Line
order: 110
---
Command line usage covers two main use cases: create and scrape a new project, scrape existing projects. Both use cases make use of a configuration file containing storage, log, scrape and concurrency settings. 

### Arguments
- `version` - Library version.
- `loglevel` - Log level. Default: `warn`.
- `logdestination` - Log destination, console or filepath. Default: `console`.
- `config` - Config filepath.
- `save` - Save the project defined in the config file. Default: `false`.
- `overwrite` - When creating a new project, whether or not to overwrite an already existing one with the same name. Default: `false`.
- `scrape` - Scrape the project defined in the config file. Attempt to save it first. Default: `false`.
- `discover` - Sequentially scrape existing projects until there are no more resources to be scraped. Default: `false`.
- `retry` - Coupled with discover option. If set, don't exit after the discovery process completes. Reinitiate project discovery after the specified number of seconds.
- `export` - Export resources as zip or csv after scraping completes using the specified filepath. If in discovery mode each project will be exported in a separate file containing the project name.
- `report` - Display scrape progress every specified number of seconds.


When you only need command line, install the package and its peer dependencies globally.
```bash
npm install -g @get-set-fetch/scraper knex sqlite3 cheerio
```
The above uses knex with sqlite3 for storage, cheerio as a dom client.


### Create a new project
```bash
gsfscrape --config scrape-config.json \
--loglevel info --logdestination scrape.log \
--save \
--overwrite \
--export project.csv
```

### Create and scrape a new project
```bash
gsfscrape --config scrape-config.json \
--loglevel info --logdestination scrape.log \
--scrape \
--overwrite \
--export project.csv
```

### Scrape existing projects
Exit when there are no more resources to scrape.
```bash
gsfscrape --config scrape-config.json \
--loglevel info --logdestination scrape.log \
--discover \
--export project.csv
```

### Scrape existing projects
After there are no more resources to scrape, retry every 60 seconds.

```bash
gsfscrape --config scrape-config.json \
--loglevel info --logdestination scrape.log \
--discover \
--retry 60
```