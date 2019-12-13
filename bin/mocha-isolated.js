#!/usr/bin/env node

'use strict';

require('essentials');

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'bail',
    'help',
    'pass-through-aws-creds',
    'recursive',
    'skip-fs-cleanup-check',
    'version',
  ],
  alias: { 'help': 'h', 'version': 'v', 'max-workers': 'w' },
  unknown: arg => {
    if (arg[0] !== '-') return;
    process.stdout.write(chalk.red.bold(`Unrecognized option ${arg}\n\n`));
    process.exit(1);
  },
});

const usage = `Usage: mocha-isolated [<options>...] [<spec>...]

Runs tests with mocha, each test is run in individual Node.js process

Options:

  --help,                   -h  Show this message
  --version,                -v  Print the version and exit

  --bail,                   -b  Bail gently after first approached test fail
  --pass-through-aws-creds      Pass through AWS env credentials
  --max-workers             -w  Maximum allowed number of workers for concurrent run
  --recursive                   Look for tests in subdirectories
  --skip-fs-cleanup-check       Do not check on modified files (allows parallel runs)
`;

if (argv.help) {
  process.stdout.write(usage);
  return;
}

if (argv.version) {
  process.stdout.write(`${require('../package').version}\n`);
  return;
}

const spawn = require('child-process-ext/spawn');
const pLimit = require('p-limit');
const mochaCollectFiles = require('mocha/lib/cli/collect-files');
const resolveEnv = require('../resolve-env');
const resolveAwsEnv = require('../resolve-aws-env');

const filePatterns = argv._;
if (!filePatterns.length) filePatterns.push('!(node_modules)/**/*.test.js', '*.test.js');

const resolveGitStatus = () =>
  spawn('git', ['status', '--porcelain']).then(
    ({ stdoutBuffer }) => String(stdoutBuffer),
    error => {
      process.stdout.write(error.stdBuffer);
      throw error;
    }
  );

const initialGitStatusDeferred = !argv['skip-fs-cleanup-check'] ? resolveGitStatus() : null;

const initialSetupDeferred = !argv['skip-fs-cleanup-check']
  ? initialGitStatusDeferred
  : Promise.resolve();

const cwdPathLength = process.cwd().length + 1;
const paths = mochaCollectFiles({
  ignore: [],
  extension: ['js'],
  file: [],
  recursive: argv.recursive,
  spec: filePatterns,
}).map(filename => filename.slice(cwdPathLength));

if (!paths.length) {
  process.stdout.write(chalk.red.bold('No test files matched\n\n'));
  process.exit(1);
}

const processesCount = (() => {
  if (!argv['skip-fs-cleanup-check']) return 1;
  const forced = Number(argv.w);
  if (forced > 0) return forced;
  return Math.max(require('os').cpus().length - 1, 1);
})();

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
    if (argv['skip-fs-cleanup-check']) return () => Promise.resolve();
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

  const env = argv['pass-through-aws-creds'] ? resolveAwsEnv() : resolveEnv();
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
      if (argv.bail) shouldAbort = true;
    })
  );
};

const limit = pLimit(processesCount);
initialSetupDeferred.then(() => Promise.all(paths.map(path => limit(() => run(path)))));
