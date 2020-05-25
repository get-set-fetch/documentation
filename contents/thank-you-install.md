---
title: Instalation complete
template: page/thank-you.pug
---
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

- Fixed all moderate and higher severity vulnerabilities from npm audit
