---
title: Extensibility
template: page/standalone-inner-page.pug
---

<p>
get-set, Fetch! extension was designed with extensibility in mind.
</p>

<p>
Each resource (html, binary) to be scraped is parsed by a series of plugins grouped in a scraping scenario.
The plugins are (mostly) independent of each other so you can add, modify, combine them in any way you like.
</p>

<p>
The extension provides builtin plugins and scenarios for most common use cases targeting static and dynamic (javascript based) html pages.
</p>

<h3 class="title">Scenarios</h3>
<hr/>
<p>
  Currently available builtin scenarios.
</p>

<table class="table">
  <thead>
    <tr>
      <th scope="col" style="width: 20%">Scenario</th>
      <th scope="col" style="width: 30%">Description</th>
      <th scope="col" style="width: 50%">Plugins</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>scrape-static-content</td>
    <td>Extracts text and binary content from static html pages based on CSS selectors</td>
    <td>
      <ul>
        <li><a href="#selectresourceplugin" class="underline">Select Resource Plugin</a></li>
        <li><a href="#fetchplugin" class="underline">Fetch Plugin</a></li>
        <li><a href="#scrollplugin" class="underline">Scroll Plugin</a></li>
        <li><a href="#extracturlsplugin" class="underline">Extract Urls Plugin</a></li>
        <li><a href="#extracthtmlcontentplugin" class="underline">Extract Html Content Plugin</a></li>
        <li><a href="#insertresourcesplugin" class="underline">Insert Resources Plugin</a></li>
        <li><a href="#upsertresourceplugin" class="underline">Upsert Resource Plugin</a></li>
      </ul>
    </td>            
  </tr>
  <tr>
    <td>scrape-dynamic-content</td>
    <td>Extracts text and binary content from dynamic (javascript) pages based on CSS selectors</td>
    <td>
      <ul>
        <li><a href="#selectresourceplugin" class="underline">Select Resource Plugin</a></li>
        <li><a href="#fetchplugin" class="underline">Fetch Plugin</a></li>
        <li><a href="#clicknavigationplugin" class="underline">Click Navigation Plugin</a></li>
        <li><a href="#extracturlsplugin" class="underline">Extract Urls Plugin</a></li>
        <li><a href="#extracthtmlcontentplugin" class="underline">Extract Html Content Plugin</a></li>
        <li><a href="#insertresourcesplugin" class="underline">Insert Resources Plugin</a></li>
        <li><a href="#upsertresourceplugin" class="underline">Upsert Resource Plugin</a></li>
      </ul>
    </td>            
  </tr>
 
</table>

<h3 class="title">Plugins</h3>
<hr/>
<p>
  Currently available builtin plugins.
</p>

<table class="table">
  <thead>
    <tr>
      <th scope="col" style="width: 20%">Plugin</th>
      <th scope="col" style="width: 30%">Description</th>
      <th scope="col" style="width: 50%">Parameters</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td><a name="selectresourceplugin">Select Resource Plugin</a></td>
    <td>Selects a resource to scrape from the current project</td>
    <td>
      <ul>
        <li>
        Delay<br/>
        Delay in milliseconds between fetching two consecutive resources.
        </li>       
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="fetchplugin">Fetch Plugin</td>
    <td>Depending on resource type (binary, html), either downloads or opens in the scraping tab the resource url</td>
    <td>
      <ul>
        <li>
        Stability Timeout<br/>
        Considers the page loaded and ready to be scraped when there are no more DOM changes within the specified amount of time (milliseconds).Only applies to html resources. Useful for bypassing preloader content.
        </li>       
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="clicknavigationplugin">Click Navigation Plugin</a></td>
    <td>Navigates via javascript click events within single page applications</td>
    <td>
      <ul>
        <li>
        Selectors<br/>
        One or multiple CSS selectors separated by new line. In a continuous loop, a single unvisited node from each selector is clicked. Waits for DOM to become stable between clicks. Comments can be added via #. A selector containing a "# content" comment will pause the plugin and execution will be deferred to the next plugin, usually responsible for the actual scraping. As an example, the following selectors "a.product # content", "a.cancel" will open product detail pages by clicking "a.product" links and then return to product list page by clicking "a.cancel" link.
        </li>   
        <li>
        Revisit<br/>
        Revisit the same DOM nodes multiple times until the DOM no longer changes. Useful for "load more content" links.
        </li>    
         <li>
        Stability Timeout<br/>
        Considers the DOM stable when there are no more DOM changes within the specified amount of time (milliseconds). Useful for allowing content to fully load between navigational clicks.
        </li>   
         <li>
        Max Resources<br/>
        Maximum number of resources to be scraped. A value of -1 disables this check.
        </li>   
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="scrollplugin">Scroll Plugin</a></td>
    <td>Performs infinite scrolling in order to load additional content</td>
    <td>
      <ul>
        <li>
        Delay<br/>
        Delay (milliseconds) between performing two consecutive scroll operations.
        </li>     
         <li>
        Change Timeout<br/>
        Waits for DOM changes within the specified amount of time (milliseconds). If no changes are detected it means scrolling didn't reveal any new content.
        </li>  
         <li>
        Max Operations<br/>
        Number of maximum scroll operations. A value of -1 scrolls till no new content is added to the page.
        </li>    
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="extracturlsplugin">Extract Urls Plugin</a></td>
    <td>Extracts new (html or binary) resource urls from the current html page</td>
    <td>
      <ul>
        <li>
        Selectors<br/>
        One or multiple CSS selectors separated by new line. Urls are extracted from link or image html elements. Comments can be added via #. You can also define a selector pair, ex: a[href$=".html"], h1.title. In this case, when exporting binary resources, the generated filename will be prefixed by h1.title value.
        </li>   
        <li>
        Max Depth<br/>
        Maximum depth of resources to be scraped. The starting resource has depth 0. Resources discovered from it have depth 1 and so on. A value of -1 disables this check.
        </li>    
         <li>
        Max Resources<br/>
        Maximum number of resources to be scraped. A value of -1 disables this check.
        </li>    
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="extracthtmlcontentplugin">Extract Html Content Plugin</a></td>
    <td>Extracts text content from the current html page</td>
    <td>
      <ul>
        <li>
        Selectors<br/>
        One or multiple CSS selectors separated by new line. Each one will be a column when exporting resources under the csv format. Comments can be added via # .
        </li>       
      </ul>
    </td>            
  </tr>
  <tr>
    <td><a name="insertresourcesplugin">Insert Resources Plugin</a></td>
    <td>Saves new resources within the current project based on newly identified urls</td>
    <td>
    </td>            
  </tr>
   <tr>
    <td><a name="upsertresourceplugin">Upsert Resource Plugin</a></td>
    <td>Updates a static resource or inserts a dynamic one after scraping it</td>
    <td>
    </td>            
  </tr>
 
</table>




