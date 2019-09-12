'use strict';

const os = require('os');
const { mkdirSync } = require('fs');
const rmDirSync = require('rimraf').sync;
const processTmpDir = require('../process-tmp-dir');
const { deferredRunner } = require('./mocha-reporter');

os.homedir = () => processTmpDir;
if (process.env.USERPROFILE) process.env.USERPROFILE = processTmpDir;
if (process.env.HOME) process.env.HOME = processTmpDir;

deferredRunner.then(runner => {
  runner.on('suite end', () => {
    // Cleanup temp homedir after each top level test run
    rmDirSync(processTmpDir);
    mkdirSync(processTmpDir);
  });
});
