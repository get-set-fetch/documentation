---
title: Examples
template: page/standalone-inner-page.pug
---

<h3 class="title">Single Static Page Scraping</h3>
<hr/>
<ul class="examples">
    <li>
        <a class="bold underline" href="https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers" target="_blank">
            https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers
        </a><br/>
        Top languages by population. <br/>
        Extract table data from a single static html page. <br/>
        Columns: rank, language, speakers, percentage of world population, language family.
    </li>
</ul>

<h3 class="title">Single Static Page Scraping with Infinite Scrolling</h3>
<hr/>
<ul class="examples">
    <li>
        <a class="bold underline" href="https://www.uefa.com/uefachampionsleague/history/rankings/players/goals_scored/" target="_blank">
            https://www.uefa.com/uefachampionsleague/history/rankings/players/goals_scored/
        </a><br/>
        UEFA Champions League top scorers. <br/>
        Extract table data from a single static html page with infinite scrolling. <br/>
        Columns: player name, goals.
    </li>
</ul>

<h3 class="title">Multiple Static Page Scraping</h3>
<hr/>
<ul class="examples">
    <li>
        <a class="bold underline" href="https://www.amazon.com/Car-Seats/b?ie=UTF8&node=1272297011" target="_blank">
            https://www.amazon.com/Car-Seats/
        </a><br/>
        Amazon.com car seats products. <br/>
        Extract first two product pages from Amazon car seats category. <br/>
        Columns: title, stars, ratings, answered questions, listing price, current price, savings.
    </li>
    <li>
        <a class="bold underline" href="https://www.goodreads.com/choiceawards/best-fiction-books-2019" target="_blank">
            https://www.goodreads.com/choiceawards/best-fiction-books-2019
        </a><br/>
        GoodReads.com best book nominees 2019. <br/>
        Extract best book nominees from the first two categories. <br/>
        Columns: title, author(s), rating.
    </li>
    <li>
        <a class="bold underline" href="https://us.spindices.com/indices/equity/dow-jones-industrial-average" target="_blank">
            https://us.spindices.com/indices/equity/dow-jones-industrial-average
        </a><br/>
        Dow Jones indices. <br/>
        Extract excel files with Dow Jones data. Filenames are renamed to a user-friendly format based on a title selector. <br/>
        Example of waiting for additional content to load in page (charts with export button) before scraping.
    </li>
</ul>

<h3 class="title">Dynamic Page Scraping</h3>
<hr/>
<ul class="examples">
    <li>
        <a class="bold underline" href="https://imgur.com/r/funny/wkp6pjn" target="_blank">
            https://imgur.com/r/funny
        </a><br/>
        Imgur images. <br/>
        Extract images (not videos) from 10 reddit/r/funny posts. <br/>
        Filenames are renamed based on img.alt attribute.
    </li>
</ul>




