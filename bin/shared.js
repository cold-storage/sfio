#!/usr/bin/env node

'use strict';

const {
  basename
} = require('path');

function beHelpful(helpAndExit) {
  if (process.argv.length < 3 ||
    process.argv[2] === 'h' ||
    process.argv[2] === '-h' ||
    process.argv[2] === '--h' ||
    process.argv[2] === 'help' ||
    process.argv[2] === '-help' ||
    process.argv[2] === '--help') {
    helpAndExit();
  }
}

exports = module.exports = {
  beHelpful,
  basename
};