---
title: Export
order: 70
---
Scraped content is stored at database level in resource entries under a project. See [Storage](storage.html) for more info.
The base exporter constructor takes an options parameter containing:
  - `filepath` - Location to store the content, absolute or relative to the current working directory.
  - `pageLimit`- Number of resources to be retrieved when doing a bulk read. Defaults to `100`.

All resources under a given project can be exported from an exporter instance.

### CSV Exporter
Exports scraped content as csv.
- `fieldSeparator`
  - default: `','`
- `lineSeparator`
  - default: `'\n'`

```js
const { CsvExporter } = require('@get-set-fetch/scraper');
const exporter = new CsvExporter({ filepath: 'file.csv', fieldSeparator: ',' });
await exporter.export(project);
```

### ZIP Exporter
Exports binary resources as a series of zip archives, one for each bulk read with size controlled by `pageLimit`.

```js
const { ZipExporter } = require('@get-set-fetch/scraper');
const exporter = new ZipExporter({ filepath: 'archive.zip');
await exporter.export(project);
```

### Custom Exporter
A custom exporter extends the base Exporter class and implements the following methods:
- `getResourceQuery`
  - Returns a subset of the following:
    - `cols`:
      - Which database columns / resource attributes to be retrieved.
      - Default: `['url', 'content']`.
    - `where`:
      - Filter resources by attribute value. Ex: `where: {projectId: 'someId'}`.
    - `whereNotNull`
      - Filter resources by non-null attributes. Ex: `whereNotNull: ['data']`. This condition is used by [ZipExporter](#zip-exporter) to only archive binary data stored in the resource `data` attribute.
- `preParse`
  - Global actions to be done before parsing the resources, like opening files/streams.
- `parse`
  - Invoked on each resource, it receives `resource`, `resourceIdx` as input parameters. Output for each resource is generated in this method.
- `postParse`
  - Global actions to be done after parsing the resources, like closing files/streams.


Here's an example of writing each resource url to a file.
```js
export default class CustomExporter extends Exporter {
  wstream: fs.WriteStream;

  getResourceQuery() {
    return { cols: [ 'url' ] };
  }

  async preParse() {
    this.wstream = fs.createWriteStream(this.opts.filepath);
  }

  async parse(resource, resourceIdx) {
    this.wstream.write(`${resourceIdx}-${resource.url}\n`);
  }

  async postParse() {
    this.wstream.close();
  }
}
```