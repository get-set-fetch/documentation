---
title: Examples
order: 90
---
What follows are real world scrape examples. If in the meanwhile the pages have changed, the project options below may become obsolete and no longer produce the expected scrape results. Last check performed on 31th October 2021. 

[Acceptance test definitions](https://github.com/get-set-fetch/test-utils/tree/main/lib/scraping-suite) may also serve as inspiration.

### How to run examples
In the github repo each example has its own directory under /examples. 
Checkout the project, install dependencies and peer-dependencies. 
What follows are the exact steps for the first [Tabular Data](#tabular-data) example.
```bash
# project checkout
git checkout https://github.com/get-set-fetch/scraper.git
cd scraper

# install project dependencies
npm ci

# install storage and browser/dom client peer dependencies
# may vary depending on example
npm install knex sqlite3 cheerio

# make the example subdirectory the current working directory
cd examples/tabular-data
```

Run example from typescript.
```bash
npx ts-node tabular-data.ts
```

Run example using command line.
```bash
../../bin/gsfscrape \
--config tabular-data-config.json \
--scrape \
--loglevel info \
--logdestination scrape.log \
--export languages.csv \
--report 1
```

After scraping succesfully completes a csv or zip file containing the scraped data is generated under the example subdirectory.

### Tabular Data
[Top languages by population](https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers){:target="_blank"}. Extract tabular data from a single static html page. [See full script.](https://github.com/get-set-fetch/scraper/blob/main/examples/tabular-data/tabular-data.ts)
```json
{
  "name": "LanguageList",
  "pipeline": "dom-static-content",
  "pluginOpts": [
    {
      "name": "ExtractUrlsPlugin",
      "maxDepth": 0
    },
    {
      "name": "ExtractHtmlContentPlugin",
      "selectorPairs": [
        {
          "contentSelector": "table.metadata + p + table.wikitable td:nth-child(2) > a:first-child",
          "label": "language"
        },
        {
          "contentSelector": "table.metadata + p + table.wikitable td:nth-child(3)",
          "label": "speakers (milions)"
        }
      ]
    }
  ],
  "resources": [
    {
      "url": "https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers"
    }
  ]
}
```

### Product Details
[OpenLibrary Asimov works](https://openlibrary.org/authors/OL34221A/Isaac_Asimov?page=1){:target="_blank"}.
Book details with author, title, rating value, review count. Also scrapes the book covers. Only the first and second page of results are being scraped. [See full script.](https://github.com/get-set-fetch/scraper/blob/main/examples/product-details/product-details.ts)
```json
{
  "name": "AsimovBooks",
  "pipeline": "dom-static-content",
  "pluginOpts": [
    {
      "name": "ExtractUrlsPlugin",
      "maxDepth": 3,
      "selectorPairs": [
        {
          "urlSelector": "#searchResults ~ .pagination > a.ChoosePage:nth-child(2)"
        },
        {
          "urlSelector": "h3.booktitle a.results"
        },
        {
          "urlSelector": "a.coverLook > img.cover"
        }
      ]
    },
    {
      "name": "ExtractHtmlContentPlugin",
      "selectorPairs": [
        {
          "contentSelector": "h1.work-title",
          "label": "title"
        },
        {
          "contentSelector": "h2.edition-byline a",
          "label": "author"
        },
        {
          "contentSelector": "ul.readers-stats > li.avg-ratings > span[itemProp=\"ratingValue\"]",
          "label": "rating value"
        },
        {
          "contentSelector": "ul.readers-stats > li > span[itemProp=\"reviewCount\"]",
          "label": "review count"
        }
      ]
    }
  ],
  "resources": [
    {
      "url": "https://openlibrary.org/authors/OL34221A/Isaac_Asimov?page=1"
    }
  ]
}
```

### PDF Extraction
[World Health Organization COVID-19 updates](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports){:target="_blank"}.
Opens each report page and downloads the pdf. [See full script.](https://github.com/get-set-fetch/scraper/blob/main/examples/pdf-extraction/pdf-extraction.ts)
```json
{
  "name": "CovidUpdates",
  "pipeline": "dom-static-content",
  "pluginOpts": [
    {
      "name": "ExtractUrlsPlugin",
      "maxDepth": 2,
      "selectorPairs": [
        {
          "urlSelector": ".sf-meeting-report-list:nth-child(5) > a.sf-meeting-report-list__item"
        },
        {
          "urlSelector": ".button-blue-background > a",
          "titleSelector": "h1.dynamic-content__heading"
        }
      ]
    }
  ],
  "resources": [
    {
      "url": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports"
    }
  ]
}
```

### Infinite Scrolling
[Google Arts&Culture historical figures](https://artsandculture.google.com/incognito/category/historical-figure){:target="_blank"}.
Keeps scrolling and loading new content. After each scroll action scraping is resumed only after DOM becomes stable and the new content is available. [See full script.](https://github.com/get-set-fetch/scraper/blob/main/examples/infinite-scrolling/infinite-scrolling.ts)
```json
{
  "name": "HistoricalFigures",
  "pipeline": "browser-static-content",
  "pluginOpts": [
    {
      "name": "BrowserFetchPlugin",
      "stabilityCheck": 2000,
      "stabilityTimeout": 5000
    },
    {
      "name": "ExtractUrlsPlugin",
      "maxDepth": 0
    },
    {
      "name": "ExtractHtmlContentPlugin",
      "selectorPairs": [
        {
          "contentSelector": "li > a[data-galabel=grid-item] > span > span span:first-child",
          "label": "name"
        },
        {
          "contentSelector": "li > a[data-galabel=grid-item] > span > span span:last-child",
          "label": "items"
        }
      ]
    },
    {
      "name": "ScrollPlugin",
      "after": "UpsertResourcePlugin",
      "maxActions": 3,
      "delay": 1000,
      "stabilityCheck": 2000,
      "stabilityTimeout": 3000
    }
  ],
  "resources": [
    {
      "url": "https://artsandculture.google.com/incognito/category/historical-figure"
    }
  ]
}
```