---
title: Getting Started
order: 1
---
**@get-set-fetch/extension** is an open source browser extension scraper with csv and zip export capabilities.

With a modular architecture, the extension provides a series of scraping scenarios with predefined default values for fast, minimal configuration scraping. All scraped resources are saved in the IndexedDB browser database.

Binary data (images, pdf files, ...) can be exported as zip archives. Text based data can be exported as csv files.

### Install extension

[
    ![Chrome](/assets/img/chrome_64x64.png)
    <span>Chrome</span>
](https://chrome.google.com/webstore/detail/get-set-fetch-web-scraper/obanemoliijohdnhjjkdbekbhdjeolnk){:target="_blank"}
{:.install-extension}

[
    ![Firefox](/assets/img/firefox_64x64.png)
    <span>Firefox</span>
](https://addons.mozilla.org/en-US/firefox/addon/get-set-fetch-web-scraper/){:target="_blank"}
{:.install-extension} 

[
    ![Edge](/assets/img/edge_64x64.png)
    <span>Edge</span>
](https://microsoftedge.microsoft.com/addons/detail/getset-fetch-web-scrap/bpoeflbhbglemehjccjfockpkhddppoh){:target="_blank"}
{:.install-extension .clear} 


### Create a new project
At the very minimum enter its name, start url and select a scraping scenario.
There are two builtin scenarios: scrape-static-content and scrape-dynamic-content responsible for scraping regular and javascript based html pages respectively. You can install community based scenarios from the scenario list page. 

See [Examples](./examples.html) to get an idea on what types of content can be scraped.

### Start scraping
You can see the newly created project in the project list page. Clicking "scrape" from the action column will start the scraping process.
Urls to be scraped will sequentially open in an additional tab with a delay defined at project creation.

You can end the scraping process at any time by closing the responsible browser tab. Next time you start scraping, the process will resume from where it was interrupted.

### Export scraped data
From the project list page, actions column, click "results". All resources scraped so far will be displayed in a tabular form. \\
Depending on the selected scraping scenario, you can export the data as either csv or zip.

### Troubleshooting

Look for warning or error entries in the logs page.
You can adjust the log level from the settings page. \\
If you find a bug, please [open an issue](https://github.com/get-set-fetch/extension/issues/){:target="_blank"} and attach in the comment any relevant log entries.