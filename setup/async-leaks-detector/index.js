'use strict';

if (process.version.match(/\d+/)[0] < 8) return; // Async leaks detector is not reliable in Node.js v6

require('../mocha-reporter').deferredRunner.then(runner =>
  runner.on('end', () => {
    // Async leaks detection
    setTimeout(() => {
      // If tests end with any orphaned async call then this callback will be invoked
      // It's a signal there's some promise chain (or in general async flow) misconfiguration
      throw new Error('Test ended with unfinished async jobs');
      // Timeout '2' to ensure no false positives, with '1' there are observable rare scenarios
      // of possibly a garbage collector delaying process exit being picked up
    }, 3).unref();
  })
);
