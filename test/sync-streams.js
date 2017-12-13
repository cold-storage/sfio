#!/usr/bin/env node

'use strict';

const fs = require('fs');
const devnull = require('dev-null');
const request = fs.createReadStream('test/request.csv');
const result = fs.createReadStream('test/result.csv');
const {
  Transform
} = require('stream');

class Result extends Transform {
  constructor() {
    super({
      objectMode: true
    });
  }
  _transform(result, encoding, cb) {
    this.cb = cb;
    this.result = result;
  }
  _flush(cb) {
    this.done = true;
    cb();
  }
  pop(cb) {
    let thisCb = this.cb;
    if (thisCb) {
      this.cb = null;
      cb(null, this.result);
      thisCb();
    } else {
      if (this.done) {
        cb();
      } else {
        var iid = setInterval(() => {
          thisCb = this.cb;
          if (thisCb) {
            this.cb = null;
            clearInterval(iid);
            cb(null, this.result);
            thisCb();
          } else if (this.done) {
            clearInterval(iid);
            cb();
          }
        }, 0);
      }
    }
  }
}

const stack = new Result();

class Request extends Transform {
  constructor(stack) {
    super({
      objectMode: true
    });
    this.stack = stack;
  }
  _transform(request, encoding, cb) {
    this.stack.pop((error, result) => {
      if (result && result.Success === 'true') {
        cb();
      } else {
        request.Id = result && result.Id;
        request.Error = result && result.Error;
        cb(null, request);
      }
    });
  }
}

result
  .pipe(require('csv-parse')({
    columns: true
  }))
  .pipe(stack);
request
  .pipe(require('csv-parse')({
    columns: true
  }))
  .pipe(new Request(stack))
  .pipe(require('csv-stringify')({
    header: true
  }))
  .pipe(process.stdout);