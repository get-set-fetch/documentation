---
title: Blog Posts
order: 10
blog: true
---
These blog entries are meant to showcase some of the [@get-set-fetch/scraper](https://github.com/get-set-fetch/scraper) capabilities.

In no particular order, each post implements a scraping scenario I've encountered while browsing relevant topics on stackoverflow, reddit and such. Some of them are not _that_ interesting but do illustrate core scraper concepts. Source code for all posts is available in the github repo under **/examples**.


{% for post in site.posts %}
<p class="post-excerpt">
<a href="{{ post.url }}">{{ post.title }}</a>
{{ post.excerpt }}
</p>
{% endfor %}
