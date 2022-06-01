---
title: "Cloud Scraping with Terraform and Ansible - Running Existing Projects"
tags: "advanced"
date: "2022-05-29"
---
Detailed steps for running the dataset projects available under [github.com/get-set-fetch/scraper/datasets](https://github.com/get-set-fetch/scraper/tree/main/datasets){:target="_blank"}. \\
Unless otherwise specified each project provisions one central PostgreSQL instance and 20 scraper instances deployed on DigitalOcean Frankfurt FRA1 datacenter.

### Install Terraform
See [official docs](https://learn.hashicorp.com/tutorials/terraform/install-cli) for adding the corresponding HashiCorp Linux repository.  
```
$ sudo apt-get update && sudo apt-get install terraform
```

### Configure Terraform
Generate an API access token `<api_token`> to be used by Terraform when creating resources. This step varies for each cloud provider. Only DigitalOcean is supported atm.

Generate a private/public key pair using [ssh-keygen](https://www.ssh.com/academy/ssh/keygen) to be used for ssh authentication. Terraform will add the public key `<public_key_file>` to each newly created resource. The private key `<private_key_file>` will be used locally when initiating ssh connections to the newly created remote resources.

Initialize provider plugins under `terraform` directory.
```
cd ./terraform
terraform init
```

### Modify Terraform Resources
You can modify machine specs and count from `./terraform/main.tf` module via `pg.size`, `scraper.count`, `scraper.size`.

```json
module "dataset_project" {
  source = "../../../cloud/terraform"

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
    count                 = 20
    name                  = "scraper"
    image                 = "ubuntu-20-04-x64"
    size                  = "s-1vcpu-1gb"
    ansible_playbook_file = "../ansible/scraper-setup.yml"
  }
}
```

### Install Ansible
Check [official docs](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) for adding the corresponding PPA or installing via pip, the Python package manager.
```
sudo apt install ansible
```

### Configure Ansible
PostgreSQL and scraper options are easily changed from `./ansible/pg-setup.yml` and `./ansible/scraper-setup.yml` respectively.
Some of them like `db.user` and `db.password` are sensitive and reference corresponding encrypted fields from `vault.yml` prefixed by `vault_`.

Change the db user and password from the initially unencrypted `./ansible/vault.yml`. Encrypt it and provide a `<vault_password>` when prompted.
```
cd ./ansible
ansible-vault encrypt vault.yml
```

### Define Environment Variables
Define some of the settings above as environment variables. Raise the number of concurrent operations to 30.

```bash
cd ./ansible

export API_TOKEN="<api_token>" \
export ANSIBLE_HOST_KEY_CHECKING=False \
export ANSIBLE_ROLES_PATH=$PWD/../../../cloud/ansible
export VAULT_PASSWORD="<vault_password>"
```

### Start Scraping
Create and configure PostgreSQL and scraper instances. \\
1st scraper instance also saves the scrape project defined under `./ansible/templates/js-scripts-config.json.j2` to the database. All scraper instances invoke the gsfscrape CLI in `--discover` mode.

```bash
terraform apply \
-var "api_token=${API_TOKEN}" \
-var "public_key_file=<public_key_file>" \
-var "private_key_file=<private_key_file>" \
-parallelism=30
```

### Monitor Progress
Run the commands from the project root directory. \\
All files are generated or downloaded under the `./exports` subdir.

Download PostgreSQL systemd and main logs.
```bash
ansible postgresql -u root -i ansible/inventory/hosts.cfg \
-m include_role -a "name=gsf-postgresql-logs" \
-e 'export_dir=exports' \
--private-key <private_key_file>
```

Download scraper systemd and scrape logs.
```bash
ansible scraper -u root -i ansible/inventory/hosts.cfg \
-m include_role -a "name=gsf-scraper-logs" \
-e 'export_dir=exports work_dir=/srv/gsf log_destination=scrape.log' \
--private-key <private_key_file>
```

Check scraping progress like number of scraped / in-progress / not-scraped resources. \\
Each call adds a new line to the csv file specified via `export_file`.
```bash
ansible postgresql -u root -i ansible/inventory/hosts.cfg \
-m include_role -a "name=gsf-scraper-stats" \
-e 'project_name=js-scripts export_file=exports/scraper-stats.csv db_name=<db_name> db_user=<db_user> db_password=<db_pass>' \
--private-key <private_key_file>
```

Example:
```
time, 2xx, 3xx, 4xx, 5xx, in_progress, not_scraped, total, per_second, scraper_instances
1653841128, 283124, 250828, 65274, 81006, 1471, 547772, 1229480, 286.04619565217394, 20
```

Download list of scraped URLs with a certain scrape status. The status can be either the http response status code or a manually asigned one.
Specify the status via `status` as a single digit.

```bash
ansible postgresql -u root -i ansible/inventory/hosts.cfg \
-m include_role -a "name=gsf-scraper-queue" \
-e 'project_name=js-scripts export_file=exports/scraper-queue-4xx.csv status=4 db_name=<db_name> db_user=<db_user> db_password=<db_pass>' \
--private-key <private_key_file>
```

### Download Scraped Content
Invoke cli `--export` on 1st scraper instance. Specify the target csv file via `export_file`.

```bash
ansible scraper[0] -u root -i ansible/inventory/hosts.cfg \
-m include_role -a "name=gsf-scraper-export" \
-e 'work_dir=/srv/gsf log_level=info log_destination=scrape.log export_file=exports/scraped-content.csv' \
--private-key <private_key_file>
```

### Shutdown
Stop and remove PostgreSQL and scraper instances.

```bash
terraform destroy \
-var "api_token=${API_TOKEN}" \
-var "public_key_file=<public_key_file>" \
-var "private_key_file=<private_key_file>" \
-parallelism=30
```
