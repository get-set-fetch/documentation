---
title: Instalation complete
template: page/thank-you.pug
---
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
