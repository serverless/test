'use strict';

require('essentials');

const path = require('path');
const spawn = require('child-process-ext/spawn');

const rootDir = path.resolve(__dirname, '../..');

(async () => {
  try {
    await spawn(
      './node_modules/.bin/_mocha',
      ['test/setup/mocha-cases/3917-invalid-exit-code.js'],
      {
        cwd: rootDir,
      }
    );
    throw new Error('Unexpected success');
  } catch (error) {
    if (error.code !== 7) throw error;
  }

  await spawn('./node_modules/.bin/_mocha', ['test/setup/mocha-cases/3920-tests-propagation.js'], {
    cwd: rootDir,
  });

  try {
    await spawn('./node_modules/.bin/_mocha', ['test/setup/mocha-cases/3938-skip-unhandled.js'], {
      cwd: rootDir,
    });
    throw new Error('Unexpected success');
  } catch (error) {
    if (error.code !== 7) throw error;
  }
})();
