'use strict';

const os = require('os');
const { emptyDirSync } = require('fs-extra');
const processTmpDir = require('../process-tmp-dir');
const { deferredRunner } = require('./mocha-reporter');

os.homedir = () => processTmpDir;
if (process.env.USERPROFILE) process.env.USERPROFILE = processTmpDir;
if (process.env.HOME) process.env.HOME = processTmpDir;

deferredRunner.then(runner => {
  runner.on('suite end', () => {
    // Cleanup temp homedir after each top level test run
    emptyDirSync(processTmpDir);
  });
});
