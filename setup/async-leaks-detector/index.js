'use strict';

if (process.version.match(/\d+/)[0] < 8) return; // Async leaks detector is not reliable in Node.js v6

const chalk = require('chalk');

require('../mocha-reporter').deferredRunner.then((runner) =>
  runner.on('end', () => {
    // Async leaks detection
    setTimeout(() => {
      // If tests end with any orphaned async call then this callback will be invoked
      // It's a signal there's some promise chain (or in general async flow) misconfiguration
      process.stdout.write(chalk.red('Error: Test ended with unfinished async jobs\n'));
      process.on('exit', () => (process.exitCode = 1));
      // Timeout '10' to ensure no false positives, with lower values there are observable rare
      // scenarios of possibly a garbage collector delaying process exit being picked up
    }, 10).unref();
  })
);
