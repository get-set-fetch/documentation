---
title: Console and File Logging
menu_title: Logging
order: 80
---
Logging is done via a wrapper over pino supporting all its log levels. There is a main logger available via `getLogger()` writing by default to console on warning level or above. Individual modules can acquire their own child logger overriding  some of the main logger settings (like level) but not the write destination.
```js
const { getLogger } = require('@get-set-fetch/scraper');
const logger = getLogger('MyModule', {level: 'debug'});
logger.info({ optional: 'obj' }, 'info msg');
```
The above outputs:
```
{"level":30,"time":1611400362464,"module":"MyModule","optional":"obj","msg":"info msg"}
```

If you want to change the write destination construct a new logger via `setLogger`. Due to the existing log wrapper, existing child loggers will also output to the new destination.
```js
const { destination } = require('pino');
const { setLogger } = require('@get-set-fetch/scraper');
setLogger({ level: 'info' }, destination('./scraping.log'))
```
The above sets the logging output to a file. Existing child loggers will also output to it.