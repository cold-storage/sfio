#!/usr/bin/env node

'use strict';

const BulkApi = require('sf-bulk-api');
const options = require('../sfio-config').source;
const api = new BulkApi(options);

const jobId = '750290000028qds';
const batchId = '75129000001ZrYP';

async function foo() {
  const req = api.getBatchRequest(batchId, jobId);
  const res = api.getBatchResult(batchId, jobId);
  const proms = await Promise.all([req, res]);
  proms[0].pipe(process.stdout);
  proms[1].pipe(process.stdout);
}

foo();