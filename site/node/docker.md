---
title: Docker
order: 120
---
## Build
All scraper images are based on alpine:3.14 docker image.
You have to build the images locally; they're not published on Docker Hub.
For both docker build and run commands make the [docker](https://github.com/get-set-fetch/scraper/tree/main/docker) repo directory the current working directory.

A set of built-time variables allows you to customize the docker image.
- `BROWSER_CLIENT` - puppeteer
- `DOM_CLIENT` - cheerio, jsdom
- `STORAGE` - sqlite, pg, mysql
- `VERSION` - source
- `USER_ID`
- `GROUP_ID`

`BROWSER_CLIENT` and `DOM_CLIENT` variables are mutually exclusive. You either scrape using a headless browser or a HTML/DOM parser library.

`USER_ID` and `GROUP_ID` are used to add the `gsfuser` user to the container. This non-root user runs the scraper, reads and writes data to the `/home/gsfuser/scraper/data` container path mounted from the host. Use `--build-arg USER_ID=$(id -u)`, `--build-arg GROUP_ID=$(id -g)` to provide the same uid/gid as the currently logged in user. If you're on Windows you can ignore these two variables.

Create an image using cheerio, sqlite and latest source code.
```bash
docker build \
--tag getsetfetch \
--build-arg DOM_CLIENT=cheerio \
--build-arg STORAGE=sqlite \
--build-arg VERSION=source \
--build-arg USER_ID=$(id -u) \
--build-arg GROUP_ID=$(id -g) .
```

Create an image using puppeteer, sqlite and latest source code.
```bash
docker build \
--tag getsetfetch \
--build-arg BROWSER_CLIENT=puppeteer \
--build-arg STORAGE=sqlite \
--build-arg VERSION=source \
--build-arg USER_ID=$(id -u) \
--build-arg GROUP_ID=$(id -g) .
```


## Run
All examples contain config, log, sqlite, csv files under `/home/gsfuser/scraper/data` container path mounted from the host for easy access to logs and exported scraped content. Remaining arguments represent [command line arguments](command-line.html). All files are available in the [docker](https://github.com/get-set-fetch/scraper/tree/main/docker) repo directory.


### Log, scrape and export data using sqlite as storage and cheerio as dom client

config-sqlite-cheerio.json
```json
{
  "storage": {
    "client": "sqlite3",
    "useNullAsDefault": true,
    "connection": {
      "filename": "gsf.sqlite"
    },
    "debug": false
  },
  "dom": {
    "client": "cheerio"
  },
  "scrape": {
    "name": "myProj",
    "pipeline": "dom-static-content",
    "pluginOpts": [
      {
        "name": "ExtractHtmlContentPlugin",
        "selectorPairs": [
          {
            "contentSelector": "h3"
          }
        ]
      },
	  {
        "name": "InsertResourcesPlugin",
        "maxResources": 1
      }
    ],
    "resources": [
      {
        "url": "https://www.getsetfetch.org/node/getting-started.html"
      }
    ]
  }
}
```

```bash
docker run \
-v <host_dir>/scraper/docker/data:/home/gsfuser/scraper/data getsetfetch:latest \
--version \
--config data/config-sqlite-cheerio.json \
--save \
--overwrite \
--scrape \
--loglevel info \
--logdestination data/scrape.log \
--export data/export.csv
```

### Log, scrape and export data using sqlite as storage and puppeteer as browser client

Use either `--security-opt seccomp=unconfined` or `--security-opt seccomp=data/chromium-security-profile.json` ([source blog](https://blog.jessfraz.com/post/how-to-use-new-docker-seccomp-profiles/)) to allow Chromium syscalls.

config-sqlite-puppeteer.json
```json
{
  "storage": {
    "client": "sqlite3",
    "useNullAsDefault": true,
    "connection": {
      "filename": "gsf.sqlite"
    },
    "debug": false
  },
  "dom": {
    "client": "puppeteer",
    "ignoreHTTPSErrors": true,
    "args": [
      "--ignore-certificate-errors",
      "--no-first-run",
      "--single-process"
    ]
  },
  "scrape": {
    "name": "myProj",
    "pipeline": "browser-static-content",
    "pluginOpts": [
      {
        "name": "ExtractHtmlContentPlugin",
        "selectorPairs": [
          {
            "contentSelector": "h3"
          }
        ]
      },
	  {
        "name": "InsertResourcesPlugin",
        "maxResources": 1
      }
    ],
    "resources": [
      {
        "url": "https://www.getsetfetch.org/node/getting-started.html"
      }
    ]
  }
}
```

```bash
docker run \
--security-opt seccomp=unconfined
-v <host_dir>/scraper/docker/data:/home/gsfuser/scraper/data getsetfetch:latest \
--version \
--config data/config-sqlite-puppeteer.json \
--save \
--overwrite \
--scrape \
--loglevel info \
--logdestination data/scrape.log \
--export data/export.csv
```

### Log, scrape and export data using postgresql as storage and puppeteer as browser client
This starts the scraper as a docker-compose service. \\
Remember to build the corresponding docker image `--build-arg STORAGE=pg --build-arg BROWSER_CLIENT=puppeteer` first :)

config-pg-puppeteer.json
```json
{
  "storage": {
    "client": "pg",
    "useNullAsDefault": true,
    "connection": {
      "host": "pg",
      "port": "5432",
      "user": "gsf-user",
      "password": "gsf-pswd",
      "database": "gsf-db"
    },
    "debug": false
  },
  "dom": {
    "client": "puppeteer",
    "ignoreHTTPSErrors": true,
    "args": [
      "--ignore-certificate-errors",
      "--no-first-run",
      "--single-process"
    ]
  },
  "scrape": {
    "name": "myProj",
    "pipeline": "browser-static-content",
    "pluginOpts": [
      {
        "name": "ExtractHtmlContentPlugin",
        "selectorPairs": [
          {
            "contentSelector": "h3",
            "label": "headline"
          }
        ]
      },
      {
        "name": "InsertResourcesPlugin",
        "maxResources": 1
      },
      {
        "name": "UpsertResourcePlugin",
        "keepHtmlData": true
      }
    ],
    "resources": [
      {
        "url": "https://www.getsetfetch.org/node/getting-started.html"
      }
    ]
  }
}
```

docker-compose.yml
```yml
version: "3.3"
services:
  pg:
    image: postgres:11-alpine
    environment:
      POSTGRES_USER: gsf-user
      POSTGRES_PASSWORD: gsf-pswd
      POSTGRES_DB: gsf-db

  gsf:
    image: getsetfetch:latest
    command: >
      --version
      --config data/config-pg-puppeteer.json
      --save
      --overwrite
      --scrape
      --loglevel info
      --logdestination data/scrape.log
      --export data/export.csv
    volumes:
      - ../data:/home/gsfuser/scraper/data
    security_opt:
      - seccomp:"../data/chromium-security-profile.json"
    depends_on:
    - pg
      
volumes:
  data:
```

```bash
# start
docker-compose up -d

# stop
docker-compose down
```
