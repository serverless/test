'use strict';

const { mkdirSync } = require('fs');
const { removeSync } = require('fs-extra');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const systemTmpDir = os.tmpdir();
const serverlessTmpDir = path.join(systemTmpDir, 'tmpdirs-serverless');
try {
  mkdirSync(serverlessTmpDir);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
}

module.exports = (function self() {
  const processTmpDir = path.join(serverlessTmpDir, crypto.randomBytes(2).toString('hex'));
  try {
    mkdirSync(processTmpDir);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    return self();
  }
  return processTmpDir;
})();

process.on('exit', () => removeSync(module.exports));
