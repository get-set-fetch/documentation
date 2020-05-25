---
title: Getting Started
template: page/standalone-inner-page.pug
---

<h3 class="title">Introduction</h3>
<hr/>
<p>
	get-set, Fetch! is an open source (MIT license) browser extension scraper with csv and zip export capabilities that originally started as an <a href="/module" class="underline">npm module</a>.
</p>
<p>
	With a modular architecture, the extension provides a series of scraping scenarios with predefined default values for fast, minimal configuration scraping.<br/>
	All scraped resources are saved in the IndexedDB browser database.
</p>
<p>
	Binary data (images, pdf files, ...) can be exported as zip archives. Text based data can be exported as csv files.
</p>

<h3 class="title">Create a new scraping project</h3>
<hr/>

<p>
Start by creating a new scraping project. At a very minimum enter its name, start url and select a scraping scenario. There are two builtin scenarios: scrape-static-content and scrape-dynamic-content. You can install additional 3rd party scenarios from the scenario list page. See examples to get an idea on what types of content can be scraped.
</p>

<p>
You can see the newly created project in the project list page. Clicking "scrape" from the action column will start the scraping process. Urls to be scraped will sequentially open in an additional tab with a delay defined at project creation.
</p>

<p>
You can end the scrapping process at any time by closing the responsible browser tab. Next time you start scraping, the process will resume from where it was interrupted.
</p>

<h3 class="title">Export scraped data</h3>
<hr/>

<p>
From the project list page, actions column, click "results". All resources scraped so far will be displayed in a tabular form.
</p>

<p>
Depending on the selected scraping scenario, you can export the data as either csv or zip.
</p>

<h3 class="title">Troubleshooting</h3>
<hr/>

<p>
Look for warning or error entries in the logs page.<br/>
You can adjust the log level from the settings page.
</p>

<p>
If you find a bug, please <a href="https://github.com/get-set-fetch/extension/issues/new" target="_blank">open an issue</a> and attach in the comment any relevant log entries.
</p>





