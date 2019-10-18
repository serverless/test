'use strict';

const initializeLogWriter = require('log-node');

const logWriter = initializeLogWriter();

if (process.env.LOG_LEVEL || process.env.LOG_DEBUG || process.env.DEBUG) return;

// Flush all gathered logs (down to DEBUG level) on test failure

const logEmitter = require('log/lib/emitter');
const { deferredRunner } = require('./mocha-reporter');

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
