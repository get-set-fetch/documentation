---
title: Extensibility
order: 3
---
Each resource (html, binary) to be scraped is parsed by a series of plugins grouped in a scraping scenario.
The plugins are (mostly) independent of each other so you can add, modify, combine them in any way you like.

The extension provides builtin plugins and scenarios for most common use cases targeting static and dynamic (javascript based) html pages.

### Scenario: scrape-static-content
Extracts text and binary content from static html pages based on CSS selectors. \\
Plugins: [Select Resource](#select-resource-plugin), 
[Fetch](#fetch-plugin), 
[Scroll](#scroll-plugin),
[Extract Urls](#extract-urls-plugin),
[Extract Html Content](#extract-html-content-plugin),
[Insert Resources](#insert-resources-plugin),
[Upsert Resource](#upsert-resource-plugin)

### Scenario: scrape-dynamic-content
Extracts text and binary content from dynamic (javascript) pages based on CSS selectors. \\
Plugins: [Select Resource](#select-resource-plugin), 
[Fetch](#fetch-plugin),
[Click Navigation](#click-navigation-plugin),
[Extract Urls](#extract-urls-plugin),
[Extract Html Content](#extract-html-content-plugin),
[Insert Resources](#insert-resources-plugin),
[Upsert Resource](#upsert-resource-plugin)

### Select Resource Plugin
Selects a resource to scrape from the current project.
- Delay - Delay in milliseconds between fetching two consecutive resources

### Fetch Plugin
Depending on resource type (binary, html), either downloads or opens in the scraping tab the resource url.
- Stability Timeout - Considers the page loaded and ready to be scraped when there are no more DOM changes within the specified amount of time (milliseconds). Only applies to html resources. Useful for bypassing preloader content.

### Click Navigation Plugin
Navigates via javascript click events within single page applications.
- Selectors - One or multiple CSS selectors separated by new line. In a continuous loop, a single unvisited node from each selector is clicked. Waits for DOM to become stable between clicks. Comments can be added via #. A selector containing a "# content" comment will pause the plugin and execution will be deferred to the next plugin, usually responsible for the actual scraping. As an example, the following selectors "a.product # content", "a.cancel" will open product detail pages by clicking "a.product" links and then return to product list page by clicking "a.cancel" link.
- Revisit - Revisit the same DOM nodes multiple times until the DOM no longer changes. Useful for "load more content" links.
- Stability Timeout - Considers the DOM stable when there are no more DOM changes within the specified amount of time (milliseconds). Useful for allowing content to fully load between navigational clicks.
- Max Resources - Maximum number of resources to be scraped. A value of -1 disables this check.
       
### Scroll Plugin
Performs infinite scrolling in order to load additional content.
- Delay - Delay (milliseconds) between performing two consecutive scroll operations.
- Change Timeout - Waits for DOM changes within the specified amount of time (milliseconds). If no changes are detected it means scrolling didn't reveal any new content.
- Max Operations - Number of maximum scroll operations. A value of -1 scrolls till no new content is added to the page.

### Extract Urls Plugin
Extracts new (html or binary) resource urls from the current html page.
- Selectors - One or multiple CSS selectors separated by new line. Urls are extracted from link or image html elements. Comments can be added via #. You can also define a selector pair, ex: a[href$=".html"], h1.title. In this case, when exporting binary resources, the generated filename will be prefixed by h1.title value.
- Max Depth - Maximum depth of resources to be scraped. The starting resource has depth 0. Resources discovered from it have depth 1 and so on. A value of -1 disables this check.
- Max Resources - Maximum number of resources to be scraped. A value of -1 disables this check.

### Extract Html Content Plugin
Extracts text content from the current html page.
- Selectors - One or multiple CSS selectors separated by new line. Each one will be a column when exporting resources under the csv format. By default the innerText property will be scraped but you can define your own using a selector pair, ex: h1, title. Comments can be added via #.
       
### Insert Resources Plugin
Saves new resources within the current project based on newly identified urls.

### Upsert Resource Plugin
Updates a static resource or inserts a dynamic one after scraping it.