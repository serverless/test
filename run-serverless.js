'use strict';

const ensureString = require('type/string/ensure');
const ensureIterable = require('type/iterable/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const ensurePlainFunction = require('type/plain-function/ensure');
const log = require('log').get('serverless:test:stdout');
const cjsResolveSync = require('ncjsm/resolve/sync');
const { writeJson } = require('fs-extra');
const { entries, values } = require('lodash');
const path = require('path');
const os = require('os');
const overrideEnv = require('process-utils/override-env');
const overrideCwd = require('process-utils/override-cwd');
const overrideArgv = require('process-utils/override-argv');
const overrideStdoutWrite = require('process-utils/override-stdout-write');
const sinon = require('sinon');
const resolveEnv = require('./resolve-env');
const disableServerlessStatsRequests = require('./disable-serverless-stats-requests');
const provisionTmpDir = require('./provision-tmp-dir');
const configureAwsRequestStub = require('./configure-aws-request-stub');
const preventCircularDepPropertyWarning = require('./prevent-circular-dep-property-warning');

const resolveServerless = async (serverlessPath, modulesCacheStub, callback) => {
  if (!modulesCacheStub) {
    disableServerlessStatsRequests(serverlessPath);
    return callback(require(serverlessPath));
  }

  const { restore: restoreProcessWarnings } = preventCircularDepPropertyWarning();
  const originalCache = Object.assign({}, require.cache);
  for (const key of Object.keys(require.cache)) delete require.cache[key];
  disableServerlessStatsRequests(serverlessPath);
  for (const [key, value] of entries(modulesCacheStub)) {
    require.cache[path.isAbsolute(key) ? key : cjsResolveSync(serverlessPath, key).realPath] = {
      exports: value,
    };
  }

  const restore = () => {
    for (const key of Object.keys(require.cache)) delete require.cache[key];
    Object.assign(require.cache, originalCache);
    restoreProcessWarnings();
  };
  try {
    return await callback(require(serverlessPath));
  } finally {
    restore();
  }
};

const resolveCwd = async ({ cwd, config }) => {
  if (cwd) return cwd;
  const tmpDirPath = await provisionTmpDir();
  await writeJson(path.join(tmpDirPath, 'serverless.json'), config);
  return tmpDirPath;
};

module.exports = async (
  serverlessPath,
  {
    awsRequestStubMap,
    cliArgs,
    config,
    cwd,
    env,
    envWhitelist,
    hooks,
    lastLifecycleHookName,
    lifecycleHookNamesBlacklist,
    modulesCacheStub,
    noService,
    pluginPathsBlacklist,
    shouldStubSpawn,
  }
) => {
  serverlessPath = path.resolve(
    ensureString(serverlessPath, {
      errorMessage: "Expected 'serverlessPath' to be a string. Received: %v",
    })
  );
  try {
    require.resolve(serverlessPath);
  } catch (error) {
    throw new TypeError(
      `Provided 'serverlessPath' (${serverlessPath}) ` +
        `doesn't point a working node module: ${error.message}`
    );
  }
  cwd = ensureString(cwd, {
    isOptional: true,
    errorMessage: 'Expected string value for `cwd` (current working directory), received %v',
  });
  config = ensurePlainObject(config, {
    isOptional: true,
    errorMessage: 'Expected plain object value for `config`, received %v',
  });
  if (!cwd && !config && !noService) {
    throw new TypeError("Either 'cwd', 'config' or 'noService' option must be provided");
  }
  if (cwd && config) {
    throw new TypeError("Expected either 'cwd' or 'config' options, not both of them");
  }
  if (noService) {
    cwd = os.homedir();
  } else if (config) {
    // By default expose configuration errors as crashes
    if (!config.configValidationMode) config.configValidationMode = 'error';
    if (!config.frameworkVersion) config.frameworkVersion = '*';
  }
  cliArgs = ensureIterable(cliArgs, {
    default: [],
    ensureItem: ensureString,
    errorMessage: 'Expected `cliArgs` to be a string collection, received %v',
  });
  pluginPathsBlacklist = ensureIterable(pluginPathsBlacklist, {
    default: [],
    ensureItem: (pluginPath) =>
      require.resolve(path.resolve(serverlessPath, ensureString(pluginPath))),
    errorMessage:
      'Expected `pluginPathsBlacklist` to be a valid plugin paths collection, received %v',
  });
  lifecycleHookNamesBlacklist = ensureIterable(lifecycleHookNamesBlacklist, {
    default: [],
    ensureItem: ensureString,
    errorMessage: 'Expected `lifecycleHookNamesBlacklist` to be a string collection, received %v',
  });
  lastLifecycleHookName = ensureString(lastLifecycleHookName, { isOptional: true });
  hooks = ensurePlainObject(hooks, {
    default: {},
    allowedKeys: ['after', 'before'],
    ensurePropertyValue: ensurePlainFunction,
    errorMessage:
      'Expected `hooks` to be a plain object with predefined supported hooks, received %v',
  });
  env = ensurePlainObject(env, {
    default: {},
    ensurePropertyValue: ensureString,
    errorMessage: 'Expected `env` to be a plain object with string property values, received %v',
  });
  envWhitelist = ensureIterable(envWhitelist, {
    isOptional: true,
    ensureItem: ensureString,
    errorMessage: 'Expected `envWhitelist` to be a var names collection, received %v',
  });
  awsRequestStubMap = ensurePlainObject(awsRequestStubMap, { isOptional: true });
  if (shouldStubSpawn) {
    if (!modulesCacheStub) modulesCacheStub = {};
    modulesCacheStub['child-process-ext/spawn'] = sinon.stub().resolves({});
  }
  const confirmedCwd = await resolveCwd({ cwd, config });
  return overrideEnv(
    { variables: Object.assign(resolveEnv(), env), whitelist: envWhitelist },
    () => {
      let stdoutData = '';
      return overrideCwd(confirmedCwd, () =>
        overrideArgv({ args: ['serverless', ...cliArgs] }, () =>
          overrideStdoutWrite(
            (data) => {
              log.info(data);
              stdoutData += data;
            },
            () =>
              resolveServerless(serverlessPath, modulesCacheStub, async (Serverless) => {
                if (hooks.before) await hooks.before(Serverless, { cwd: confirmedCwd });
                // Intialize serverless instances in preconfigured environment
                let serverless = new Serverless();
                if (serverless.triggeredDeprecations) {
                  serverless.triggeredDeprecations.clear();
                }
                const pluginConstructorsBlacklist = pluginPathsBlacklist.map((pluginPath) =>
                  require(pluginPath)
                );
                try {
                  await serverless.init();

                  if (serverless.invokedInstance) serverless = serverless.invokedInstance;
                  const { pluginManager } = serverless;
                  const blacklistedPlugins = pluginManager.plugins.filter((plugin) =>
                    pluginConstructorsBlacklist.some((Plugin) => plugin instanceof Plugin)
                  );
                  for (const [index, Plugin] of pluginConstructorsBlacklist.entries()) {
                    if (!blacklistedPlugins.some((plugin) => plugin instanceof Plugin)) {
                      throw new Error(
                        `Didn't resolve a plugin instance for ${pluginPathsBlacklist[index]}`
                      );
                    }
                  }

                  const { hooks: lifecycleHooks } = pluginManager;
                  const unconfirmedLifecycleHookNames = new Set(lifecycleHookNamesBlacklist);
                  for (const hookName of Object.keys(lifecycleHooks)) {
                    unconfirmedLifecycleHookNames.delete(hookName);
                    if (lifecycleHookNamesBlacklist.includes(hookName)) {
                      delete lifecycleHooks[hookName];
                      continue;
                    }

                    lifecycleHooks[hookName] = lifecycleHooks[hookName].filter(
                      (hookData) =>
                        !blacklistedPlugins.some((blacklistedPlugin) =>
                          values(blacklistedPlugin.hooks).includes(hookData.hook)
                        )
                    );
                  }
                  if (unconfirmedLifecycleHookNames.size) {
                    throw new Error(
                      `${Array.from(unconfirmedLifecycleHookNames).join(
                        ', '
                      )} blacklisted lifecycle hook names were not recognized.`
                    );
                  }

                  if (lastLifecycleHookName) {
                    const { getHooks } = pluginManager;
                    let hasLastHookFinalized = null;
                    pluginManager.getHooks = function (events) {
                      if (hasLastHookFinalized) return [];
                      if (hasLastHookFinalized === false) {
                        return getHooks.call(this, events);
                      }
                      const lastEventIndex = events.indexOf(lastLifecycleHookName);
                      if (lastEventIndex === -1) return getHooks.call(this, events);
                      events = events.slice(0, lastEventIndex + 1);
                      const eventHooks = getHooks.call(this, events);
                      if (!eventHooks.length) {
                        hasLastHookFinalized = true;
                        return eventHooks;
                      }
                      hasLastHookFinalized = false;
                      const lastHook = eventHooks[eventHooks.length - 1];
                      const hookFunction = lastHook.hook;
                      lastHook.hook = async function () {
                        try {
                          return await hookFunction.call(this);
                        } finally {
                          hasLastHookFinalized = true;
                        }
                      };
                      return eventHooks;
                    };
                  }

                  if (awsRequestStubMap) {
                    configureAwsRequestStub(serverless.getProvider('aws'), awsRequestStubMap);
                  }

                  // Run plugin manager hooks
                  await serverless.run();
                  if (hooks.after) await hooks.after(serverless);
                  const awsProvider = serverless.getProvider('aws');
                  return {
                    serverless,
                    stdoutData,
                    cfTemplate: serverless.service.provider.compiledCloudFormationTemplate,
                    awsNaming: awsProvider && awsProvider.naming,
                  };
                } catch (error) {
                  throw Object.assign(error, {
                    serverless,
                    stdoutData,
                  });
                }
              })
          )
        )
      );
    }
  );
};
