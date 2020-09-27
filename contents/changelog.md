---
title: ChangeLog
template: page/standalone-inner-page.pug
---
<h3 class="title">Version 0.4.1 (2020-09-26)</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Firefox, Edge, Opera support
- Redirect support
- New FetchPlugin option: maxStabilityWaitingTime
- Current version is now visible in Front-end
- Scraping examples update

<h5 class="subtitle">Fixed</h5>

- When exporting binary resources name fragments no longer repeat

<h5 class="subtitle">Security</h5>

- Fixed moderate and higher severity vulnerabilities from npm audit

<h3 class="title">Version 0.3.0 (2020-07-19)</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Database import/export capabilities
- ExtractHtmlContentPlugin: better handling of partial missing content from css selector results of different lengths
- ExtractHtmlContentPlugin: can now scrape any HtmlElement properties not just innerText
- Improved error handling
- Partial Firefox support

<h3 class="title">Version 0.2.0 (2020-05-24)</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- New plugins: ClickNavigationPlugin, ScrollPlugin
- New scenarios: scrape-dynamic-content, scrape-static-content
- Plugin management refactoring
- Closing the scraping tab stops the scraping process
- Const json-schema fields are no longer displayed
- Redesigned form layout
- Identify resource extension based on mime type
- Resources now store parent data, useful for renaming filenames when exported
- Result urls are now rendered as links
- Improved error handling
- Example page

<h5 class="subtitle">Fixed</h5>

- Scrape result list no longer causes horizontal scrolling
- Plugins running within the scrapped page are only initialized once

<h5 class="subtitle">Security</h5>

- Fixed moderate and higher severity vulnerabilities from npm audit

<h3 class="title">Version 0.1.2 (2019-11-24)</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Scrape project configurations can now be exported / imported as URI hashes

<h5 class="subtitle">Fixed</h5>

- Scraping errors no longer generate an infinite retry loop

<h5 class="subtitle">Security</h5>

- Fixed all moderate and higher severity vulnerabilities from npm audit

<h3 class="title">Version 0.1.1 (2019-06-23)</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Getting Started page
- Additional crawl options: domain regexp filter, pathname regexp filter
- Additional scrape options: resource regexp filter
- Html redirect handling
- Each scenario is now using a single json-schema instead of the ui/model schema combo
- Front-end log capability
- Export logs as csv

<h5 class="subtitle">Fixed</h5>

- Csv content is now correctly exported
- Updating a project crawl options also updates the corresponding site(s) definitions
- Various front-end bugs

<h5 class="subtitle">Security</h5>

- Fixed all moderate and higher severity vulnerabilities from npm audit

<h3 class="title">Version 0.1.0 (2019-04-21) - initial release</h3>
<hr/>

<h5 class="subtitle">Added</h5>

- Define scrape plugins
- Define scrape scenarios based on configurable plugins
- Define scrape projects based on configurable scenarios
- View and install available scrape scenarios listed on the extension [homepage](https://github.com/get-set-fetch/extension)
- Export scrape projects as either csv or zip
- Record and view crawl/scrape logs based on log level: DEBUG, WARN, ERROR,..

<p></p>

- Builtin plugins:
  - SelectResourcePlugin: selects a 'not-crawled' resource for crawling
  - FetchPlugin: opens html resources in browser or downloads binary resources
  - ExtractUrlsPlugin: extracts html links and img srcs from the current html page
  - UpdateResourcePlugin: adds the scrape info to a resource
  - InsertResourcesPlugin: adds a new resource to the database with the crawled status 'not-crawled'

<p></p>

- Builtin scenarios:
  - ExtractResourcesScenario: extract binary resources like images, pdfs, ....
  - ExtractHtmlContentScenario: extracts text representation of html nodes


<h5 class="subtitle">Security</h5>

- Fixed all moderate and higher severity vulnerabilities from npm audit