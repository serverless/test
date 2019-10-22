'use strict';

const log = require('log').get('mocha');
const initializeLogWriter = require('log-node');
const { deferredRunner } = require('./mocha-reporter');

const logWriter = initializeLogWriter();

deferredRunner.then(runner => {
  runner.on('suite', suite => log.debug('suite %s', suite.title));
  runner.on('test', suite => log.debug('test %s', suite.title));
});

if (process.env.LOG_LEVEL || process.env.LOG_DEBUG || process.env.DEBUG) return;

// Flush all gathered logs (down to DEBUG level) on test failure

const logEmitter = require('log/lib/emitter');

const logsBuffer = [];
const flushLogs = () => {
  logsBuffer.forEach(event => {
    if (!event.message) logWriter.resolveMessage(event);
    logWriter.writeMessage(event);
  });
  logsBuffer.length = 0; // Empty array
};

logEmitter.on('log', event => {
  logsBuffer.push(event);
  if (!event.message) logWriter.resolveMessageTokens(event);
});
deferredRunner.then(runner => {
  runner.on('suite end', suite => {
    if (!suite.parent || !suite.parent.root) return;

    logsBuffer.length = 0; // Empty array
  });
  runner.on('fail', flushLogs);
});

module.exports.flushLogs = flushLogs;
