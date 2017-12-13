# sfio

sfio makes it easy to stream CSV data in and out of Salesforce.

sfio uses the new Bulk API 2.0 for insert, update, upsert, and delete.
https://developer.salesforce.com/blogs/2017/12/slim-new-bulk-api-v2.html

The new Bulk API 2.0 doesn't support query. It also doesn't support hard delete.
For these we use the old Bulk API.

## Bulk API 2.0

It remains to be seen how well the new Bulk API 2.0 magically gets around locks
and timeouts. They sure talk it up big.

The primary win for us is no more lookups. The 2.0 API lets you use external
ID fields to link related objects.

https://developer.salesforce.com/docs/atlas.en-us.api_bulk_v2.meta/api_bulk_v2/datafiles_csv_rel_field_header_row.htm

## Usage

All commands have help. Just type the command without any argument.
You can also use common parameters like `-h` nd `--help`.

```sh
sf-query          SOQL [pkChunking] [queryAll] > some.csv

sf-insert         OBJECT [poll] < some.csv
sf-update         OBJECT [poll] < some.csv
sf-upsert         OBJECT [poll] < some.csv
sf-delete         OBJECT [poll] < some.csv

sf-error          JOB_ID [noErrorColumn] [noErrors] [noUnprocessed]
```

Wish List

```sh
sf-validate       SOQL or CSV

sf-info           JOB_ID
sf-abort          JOB_ID
sf-close          JOB_ID
```

## Confguration

sfio will look for a file named sfio-config.js in the current directory. This
file should NOT contain any secrets. The file should simply point to the actual
config file which may be located wherever you choose.

The config file will contain both source and destination information because you
may be querying from one Salesforce organization and updating another.

**./sfio-config.js**

```js
exports = module.exports = require('../sfio-my-customer.js');
```

**../sfio-my-customer.js**

```js
exports = module.exports = {
  source: {
    url: 'https://login.salesforce.com',
    username: 'pipedream@candoris.com',
    password: '***',
    token: '***',
    apiVersion: '41.0',
    consumerKey: '***',
    consumerSecret: '***'
  },
  dest: {
    url: 'https://login.salesforce.com',
    username: 'pipedream@candoris.com',
    password: '***',
    token: '***',
    apiVersion: '41.0',
    consumerKey: '***',
    consumerSecret: '***'
  }
}
```

## MISC

```sh
export PATH=./bin:$PATH
export PATH=./node_modules/pipedream/bin:$PATH
```
