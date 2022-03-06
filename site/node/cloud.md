---
title: Cloud Scraping with Terraform and Ansible
menu_title: Cloud
order: 130
---
The npm package contains a Terraform module and multiple Ansible roles for distributed cloud scraping using one [PostgreSQL database](storage.html#postgresql) and multiple scraper instances using [dom-like clients](clients.html#dom-clients) such as Cheerio and Jsdom. Each web scraper consumes a queue of to-be-scraped URLs stored at database level, scrapes them [concurrently](scrape.html#concurrency-options) and saves the content back. 

<!-- For a step by step guide see [Cloud Scraping with Terraform and Ansible](/blog/cloud-scraping-terraform-ansible.html) post. \ -->
Source files are available in the repository [/cloud](https://github.com/get-set-fetch/scraper/tree/main/cloud) directory. \
A real world example is available under  [@get-set-fetch/benchmarks/cloud](https://github.com/get-set-fetch/benchmarks/tree/main/cloud).


## Terraform Module
Available under `node_modules/@get-set-fetch/scraper/cloud/terraform` the module declares the following input variables:
- `public_key_file`
  - authorized key, part of a SSH key pair
  - deployed and used on remote instances for SSH authentication
- `public_key_name`
  - name the public key is registered under
- `private_key_file`
  - identity key, part of a SSH key pair
  - used locally for SSH authentication
- `ansible_inventory_file`
  - contains IP addresses of the created instances split into two groups: postgresql and scraper
  - makes it possible to target either group via Ansible roles and/or playbooks
- `region`
  - region to deploy in
- `pg` 
  - settings related to PostgreSQL instance
  - `name` 
    - instance name
  - `image` 
    - image id
    - default: `ubuntu-20-04-x64`
  - `size` 
    - instance type
    - default: `s-4vcpu-8gb`
  - `ansible_playbook_file`
    - playbook to run after cloud-init
- `scraper`
  - settings related to scraper instances
  - `count` 
    - number of instances
    - default : `1`
  - `name` 
    - instance name prefix, full names will be generated as "prefix-0", "prefix-1", ... 
  - `image`
    - image id
    - default: `ubuntu-20-04-x64`
  - `size` 
    - instance type
    - default: `s-1vcpu-1gb`
  - `ansible_playbook_file` 
    - playbook to run after cloud-init

Supported providers:
- [DigitalOcean](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet)


Custom module example referencing the builtin one under `node_modules`.
```
module "cloud_scraping" {
  source = "../../node_modules/@get-set-fetch/scraper/cloud/terraform"

  region                 = "fra1"
  public_key_name        = "get-set-fetch"
  public_key_file        = var.public_key_file
  private_key_file       = var.private_key_file
  ansible_inventory_file = "../ansible/inventory/hosts.cfg"

  pg = {
    name                  = "pg"
    image                 = "ubuntu-20-04-x64"
    size                  = "s-4vcpu-8gb"
    ansible_playbook_file = "../ansible/pg-setup.yml"
  }

  scraper = {
    count                 = 1
    name                  = "scraper"
    image                 = "ubuntu-20-04-x64"
    size                  = "s-1vcpu-1gb"
    ansible_playbook_file = "../ansible/scraper-setup.yml"
  }
}
```

## Ansible Roles
Available under `node_modules/@get-set-fetch/scraper/cloud/ansible` the provided Ansible roles can be either referenced from your own playbooks or via ansible cli. If invoked from the command line you also must provide the `--private-key`.

### gsf-postgresql-logs
Retrieves systemd log messages since last boot and service status. Retrieves PostgreSQL logs.

Variables:
- `export_dir`
  - local export destination directory

```
ansible postgresql -u root -i <ansible_inventory_file> -m include_role -a "name=gsf-postgresql-logs" \
-e 'export_dir=<export_dir> \
--private-key <private_key_file> 
```

### gsf-postgresql-setup
Creates a database and adds a user to it. Allows for remote connections ONLY from the virtual private cloud. \
Tunes the server.

Variables:
- `db`
  - `name`
    - database to be created
  - `user`
    - user granted ALL privileges on the above database
  - `password`
    - corresponding user password
- `pg_config` 
  - settings related to database tunning
  - default values target a vm with 4 vCPU, 8 GB RAM using [pgtune](https://github.com/le0pard/pgtune){:target="_blank"} as base config
  - each entry contains the setting key and its corresponding default value
  - see PostgreSQL [connection settings](https://www.postgresql.org/docs/14/runtime-config-connection.html){:target="_blank"} and [resource consumptation](https://www.postgresql.org/docs/14/runtime-config-resource.html){:target="_blank"} for more details
    - `max_connections`: 100 
    - `shared_buffers`: 2GB
    - `effective_cache_size`: 6GB
    - `maintenance_work_mem`: 512MB
    - `checkpoint_completion_target`: 0.9
    - `wal_buffers`: 16MB
    - `default_statistics_target`: 100
    - `random_page_cost`: 1.1
    - `effective_io_concurrency`: 200
    - `work_mem`: 10485kB
    - `min_wal_size`: 1GB
    - `max_wal_size`: 4GB
    - `max_worker_processes`: 4
    - `max_parallel_workers_per_gather`: 2
    - `max_parallel_workers`: 4
    - `max_parallel_maintenance_workers`: 2

### gsf-scraper-export
Remotely invokes `gsfscrape --export` via [command line](command-line.html). Downloads the generated csv file to `export_file`.

Variables:
- `work_dir`
  - remote directory containing a `gsf-config.json` config file.
- `export_file`
  - local csv file destination
- `log_level`
  - log level for the export action 
- `log_destination`
  - remote log path relative to `work_dir`

### gsf-scraper-logs
Downloads getsetfetch systemd service status, output and error logs. Downloads the scrape log.

Variables:
- `work_dir`
  - remote directory containing the scrape log
- `export_dir`
  - local destination directory
- `log_destination`
  - remote scrape log path relative to `work_dir`

```
ansible scraper -u root -i <ansible_inventory_file>  -m include_role -a "name=gsf-scraper-logs" \
-e 'export_dir=<export_dir> work_dir=<work_dir> log_destination=<log_destination> \
--private-key <private_key_file>
```


### gsf-scraper-setup
Installs @get-set-fetch/scraper and dependencies. Creates a systemd service. \
Uploads additional files like configuration, custom plugins, etc.

Variables:
- `db`
  - connection settings
  - `name`
  - `user`
  - `password`
  - `pool`
    - `min`
    - `max`
- `scraper`
  - `uv_threadpool_size`
    - number of threads used in libuv's threadpool used by nodejs
    - relevant (from a scraping point of view) nodejs APIs using the threadpool: dns.lookup()
  - `npm_install`
    - list of npm packages to be installed
    - either library@version or tarball archives
  - `log`
    - `destination`
      - log filepath
    - `level`
      - minimum log level
  - `files`
    - additional files to be copied on the remote vm
    - `scrape_urls`
      - csv file containing URLs to be scraped
    - `gsf_config`
      - json scrape configuration file
    - `additional`
      - list of any other files to be copied, like custom plugins referenced in `gsf_config`

Ansible playbook example.
```
roles:
  - role: gsf-scraper-setup
    vars:
      db:
        name: getsetfetch
        user: "{{ vault_db_user }}"
        password: "{{ vault_db_password }}"
        pool:
          min: 10
          max: 10
      scraper:
        uv_threadpool_size: 14 # 4 + 10
        npm_install:
          - knex@0.95.14
          - pg@8.7.1
          - cheerio@1.0.0-rc.10
          - "@get-set-fetch/scraper@0.10.0"
        log:
          level: error
        files:
            scrape_urls: '1000k_urls.csv'
            gsf_config: templates/gsf-config-saved-urls.json.j2
            additional:
                - PerfNodeFetchPlugin.js
```

### gsf-scraper-stats
Checks scraping progress. With each call adds a new row in a stats csv file.

Variables
- `project_name`
  - target scrape project
- `export_file`
  - local csv file destination
- `db_name`
- `db_user`
- `db_password`

Example of stats content. \
2xx - 5xx columns represent number of resources scraped with a corresponding http response status code.
```
time, 2xx, 3xx, 4xx, 5xx, in_progress, not_scraped, per_second, scraper_instances
1644588918, 74216, 0, 0, 0, 318, 925466, , 2
1644588940, 102469, 0, 0, 0, 345, 897186, 1284.2272727272727, 2
1644589144, 364334, 0, 0, 0, 272, 635394, 1283.6519607843138, 2
1644589365, 655711, 0, 0, 0, 78, 344211, 1318.447963800905, 2
1644589481, 814907, 0, 0, 0, 58, 185035, 1372.3793103448277, 2
```

```
ansible postgresql -u root -i <ansible_inventory_file> -m include_role -a "name=gsf-scraper-stats" \
-e 'project_name=<project_name> export_file=<export_file> db_name=<db_name> \
db_user=<db_user> db_password=<db_password>' \
--private-key <private_key>
```