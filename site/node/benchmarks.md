---
title: Synthetic Benchmarks Using Multiple Scraper Instances
menu_title: Benchmarks
order: 11
---
The goal of these benchmarks is to showcase the [@get-set-fetch/scraper](https://github.com/get-set-fetch/scraper) scalability. By using mocked content and no external traffic, results are not influenced by server response times and upload/download speeds.

A postgresql instance stores the scraping queue. The queue is consumed in parallel by multiple scraper instances with the scraped content saved back in the database.

Benchmarks are executed in cloud using one vm (1vCPU, 1GB memory) for each scraper plus an extra vm (4vCPU, 8GB memory) for the postgresql database. Using DigitalOcean API, the machine sizes are `s-1vcpu-1gb`, `s-4vcpu-8gb` respectively.

Scrapers are started as systemd services invoking the [command line utility](command-line.html). The entire configuration is deployed using [Terraform and Ansible](cloud.html).

See [@get-set-fetch/benchmarks](https://github.com/get-set-fetch/benchmarks) about reproducing the results.

### 1 million URLs initial queue length

The first scraper instance is responsible for creating the scraping project. It also adds 1000k URLs in the database queue loaded from an external csv file. The remaining scraper instances are in discovery mode, consuming the database queue. Version used: 0.10.0.

![](https://get-set-fetch.github.io/benchmarks/charts/v0.10.0-total-exec-time-1e6-saved-entries.svg)

Each scraper instance has a concurrency limit of 100. This means maximum 100 URLs are scraped in parallel. Using 4 instances ~1850 URLs are scraped every second taking 9 minutes to scrape 1 million URLs. \
8 scraper instances put a 100% CPU load on the vm hosting the database for a total of ~2750 URLs scraped per second. In real world scenarios this will definitely not be your bottleneck.

### 1 URL initial queue length
URLs to-be-scraped are continuously discovered. This scenario simulates scraping result pages with 50 URLs to-be-discovered per page. Only a single scraper instance is used as the queue length always stays under 50.

![](https://get-set-fetch.github.io/benchmarks/charts/v0.10.0-total-exec-time-1e6-new-entries.svg)

Like in the previous scenario, the scraper instance has a concurrency limit of 100. 
The limit is never reached due to the 50 results per page enforcement. ~210 URLs are scraped every second.


### Conclusion

For quick, small projects under 10K URLs storing the queue and scraped content under SQLite is fine. \
For anything larger use PostgreSQL. You will be able to start/stop/resume the scraping process across multiple scraper instances each with its own IP and/or dedicated proxies. 
