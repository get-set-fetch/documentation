---
title: Examples
order: 2
---
### Single Static Page Scraping
<hr/>

- [https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers](https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers){:target="_blank"}\\
Top languages by population.\\
Extract table data from a single static html page.\\
Columns: rank, language, speakers, percentage of world population, language family.


### Single Static Page Scraping with Infinite Scrolling
<hr/>

- [https://www.uefa.com/uefachampionsleague/history/rankings/players/goals_scored/](https://www.uefa.com/uefachampionsleague/history/rankings/players/goals_scored/){:target="_blank"}\\
UEFA Champions League top scorers.\\
Extract table data from a single static html page with infinite scrolling.\\
Columns: player name, goals.


### Multiple Static Page Scraping
<hr/>

- [https://www.amazon.com/Car-Seats/](https://www.amazon.com/Car-Seats/b?ie=UTF8&node=1272297011){:target="_blank"}\\
Amazon.com car seats products.\\
Extract first two product pages from Amazon car seats category.\\
Columns: title, stars, ratings, answered questions, listing price, current price, savings.

- [https://www.goodreads.com/choiceawards/best-fiction-books-2019](https://www.goodreads.com/choiceawards/best-fiction-books-2019){:target="_blank"}\\
GoodReads.com best book nominees 2019.\\
Extract best book nominees from the first two categories.\\
Columns: title, author(s), rating.

- [https://us.spindices.com/indices/equity/dow-jones-industrial-average](https://us.spindices.com/indices/equity/dow-jones-industrial-average){:target="_blank"}\\
Dow Jones indices.\\
Extract excel files with Dow Jones data. Filenames are renamed to a user-friendly format based on a title selector.\\
Example of waiting for additional content to load in page (charts with export button) before scraping.


### Dynamic Page Scraping
<hr/>

- [https://imgur.com/r/funny](https://imgur.com/r/funny/wkp6pjn){:target="_blank"}\\
Imgur images.\\
Extract images (not videos) from 10 reddit/r/funny posts.\\
Filenames are renamed based on img.alt attribute.

