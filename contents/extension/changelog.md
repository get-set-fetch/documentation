---
title: ChangeLog
template: page/standalone-inner-page.pug
---
<h3 class="title">Version 0.1.1 (pending)</h3>
<hr/>

<h5 class="subtitle">Fixed</h5>

* Csv content is now correctly exported

<h3 class="title">Version 0.1.0 (2019-04-21) - initial release</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Define crawl plugins
- Define crawl scenarios based on configurable plugins
- Define crawl projects based on configurable scenarios
- View and install available crawl scenarios listed on the extension [homepage](https://github.com/get-set-fetch/extension)
- Export crawled projects as either CSV or ZIP
- Record and view crawl logs based on log level: DEBUG, WARN, ERROR,..

- Builtin plugins:
  - FetchPlugin: opens html resources in browser or downloads binary resources
  - ExtractUrlsPlugin: extracts html links and img srcs from the current html page
  - InsertResourcePlugin: adds a new resource to the database with the crawled status 'not-crawled'
  - SelectResourcePlugin: selects a 'not-crawled' resource for crawling
  - UpdateResourcePlugin: adds the crawled info to a resource

- Builting scenarios:
  - ExtractResourcesScenario: extract binary resources like images, pdfs, ....
  - ExtractHtmlContentScenario: extracts text representation of html nodes


<h5 class="subtitle">Security</h5>

* Fixed all moderate and higher severity vulnerabilities from npm audit