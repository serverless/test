#!/usr/bin/env node

'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('child-process-ext/spawn');
const chalk = require('chalk');
const pLimit = require('p-limit');
const mochaCollectFiles = require('mocha/lib/cli/collect-files');
const resolveEnv = require('../resolve-env');
const resolveAwsEnv = require('../resolve-aws-env');

const inputOptions = {};
const filePatterns = process.argv.slice(2).filter(arg => {
  if (!arg.startsWith('-')) return true;
  switch (arg) {
    case '--bail':
      inputOptions.bail = true;
      break;
    case '--pass-through-aws-creds':
      inputOptions.passThroughAwsCreds = true;
      break;
    case '--skip-fs-cleanup-check':
      inputOptions.skipFsCleanupCheck = true;
      break;
    default:
      process.stdout.write(chalk.red.bold(`Unrecognized option ${arg}\n\n`));
      process.exit(1);
  }
  return false;
});
if (!filePatterns.length) filePatterns.push('!(node_modules)/**/*.test.js', '*.test.js');

const resolveGitStatus = () =>
  spawn('git', ['status', '--porcelain']).then(
    ({ stdoutBuffer }) => String(stdoutBuffer),
    error => {
      process.stdout.write(error.stdBuffer);
      throw error;
    }
  );

const initialGitStatusDeferred = !inputOptions.skipFsCleanupCheck ? resolveGitStatus() : null;

const initialSetupDeferred = !inputOptions.skipFsCleanupCheck
  ? initialGitStatusDeferred
  : Promise.resolve();

const cwdPathLength = process.cwd().length + 1;
const paths = mochaCollectFiles({
  ignore: [],
  extension: ['js'],
  file: [],
  recursive: process.argv.includes('--recursive'),
  spec: filePatterns,
}).map(filename => filename.slice(cwdPathLength));

if (!paths.length) {
  process.stdout.write(chalk.red.bold('No test files matched\n\n'));
  process.exit(1);
}

const processesCount = !inputOptions.skipFsCleanupCheck
  ? 1
  : Math.max(require('os').cpus().length - 1, 1);

const isMultiProcessRun = processesCount > 1;

const { ongoing, cliFooter } = (() => {
  if (!isMultiProcessRun) return {};
  return { ongoing: new Set(), cliFooter: require('cli-progress-footer')() };
})();

const failed = [];
process.on('exit', () => {
  if (!failed.length) return;
  process.stdout.write('\n');
  for (const testPath of failed) process.stdout.write(chalk.red.bold(`${testPath} failed\n`));
});

let shouldAbort = false;
const run = path => {
  if (shouldAbort) return null;
  if (isMultiProcessRun) {
    ongoing.add(path);
    cliFooter.updateProgress(Array.from(ongoing));
  }

  const onFinally = (() => {
    if (isMultiProcessRun) {
      return ({ stdBuffer }) => {
        ongoing.delete(path);
        cliFooter.updateProgress(Array.from(ongoing));
        process.stdout.write(stdBuffer);
        return Promise.resolve();
      };
    }
    if (inputOptions.skipFsCleanupCheck) return () => Promise.resolve();
    return () =>
      Promise.all([initialGitStatusDeferred, resolveGitStatus()]).then(
        ([initialStatus, currentStatus]) => {
          if (initialStatus !== currentStatus) {
            process.stdout.write(
              chalk.red.bold(`${path} didn't clean created temporary files\n\n`)
            );
            failed.push(path);
            process.exitCode = 1;
            shouldAbort = true;
          }
        }
      );
  })();

  const env = inputOptions.passThroughAwsCreds ? resolveAwsEnv() : resolveEnv();
  env.FORCE_COLOR = '1';
  return spawn('node', ['node_modules/.bin/_mocha', path], {
    stdio: isMultiProcessRun ? null : 'inherit',
    env,
  }).then(onFinally, error =>
    onFinally(error).then(() => {
      failed.push(path);
      process.stdout.write(chalk.red.bold(`${path} failed\n\n`));
      if (error.code > 2) throw error;
      process.exitCode = 1;
      if (inputOptions.bail) shouldAbort = true;
    })
  );
};

const limit = pLimit(processesCount);
return initialSetupDeferred.then(() => Promise.all(paths.map(path => limit(() => run(path)))));
