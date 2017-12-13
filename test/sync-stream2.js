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
    this.rows = [];
    this.done = false;
  }
  _transform(result, encoding, cb) {
    if (this.rows.length < 1000) {
      this.rows.push(result);
      cb();
    }
    const tid = setInterval(() => {
      if (this.rows.length < 1000) {
        clearInterval(tid);
        this.rows.push(result);
        cb();
      }
    }, 10);
  }
  _flush(cb) {
    this.done = true;
    cb();
  }
  pop(cb) {
    if (this.done) {
      cb();
    } else {
      if (this.rows.length) {
        cb(null, this.rows.unshift());
      } else {
        const tid = setInterval(() => {
          if (this.rows.length) {
            clearInterval(tid);
            cb(null, this.rows.unshift());
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
  .pipe(stack)
  .pipe(devnull());
request
  .pipe(require('csv-parse')({
    columns: true
  }))
  .pipe(new Request(stack))
  .pipe(require('csv-stringify')({
    header: true
  }))
  .pipe(process.stdout);