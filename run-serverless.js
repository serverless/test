'use strict';

const ensureString = require('type/string/ensure');
const ensureIterable = require('type/iterable/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const ensurePlainFunction = require('type/plain-function/ensure');
const cjsResolveSync = require('ncjsm/resolve/sync');
const { writeJson } = require('fs-extra');
const { entries, values } = require('lodash');
const path = require('path');
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

const resolveServerless = (serverlessPath, modulesCacheStub, callback) => {
  if (!modulesCacheStub) {
    disableServerlessStatsRequests(serverlessPath);
    return callback(require(serverlessPath));
  }

  const { restore: restoreProcessWarnings } = preventCircularDepPropertyWarning();
  const originalCache = Object.assign({}, require.cache);
  for (const key of Object.keys(require.cache)) delete require.cache[key];
  disableServerlessStatsRequests(serverlessPath);
  for (const [key, value] of entries(modulesCacheStub)) require.cache[key] = { exports: value };

  const restore = () => {
    for (const key of Object.keys(require.cache)) delete require.cache[key];
    Object.assign(require.cache, originalCache);
    restoreProcessWarnings();
  };
  try {
    return callback(require(serverlessPath)).then(
      (result) => {
        restore();
        return result;
      },
      (error) => {
        restore();
        throw error;
      }
    );
  } catch (error) {
    restore();
    throw error;
  }
};

const resolveCwd = ({ cwd, config }) =>
  new Promise((resolve) => {
    if (cwd) return resolve(cwd);
    return resolve(
      provisionTmpDir().then((tmpDirPath) =>
        writeJson(path.join(tmpDirPath, 'serverless.json'), config).then(() => tmpDirPath)
      )
    );
  });

module.exports = (
  serverlessPath,
  {
    cwd,
    config,
    cliArgs,
    env,
    envWhitelist,
    pluginPathsBlacklist,
    lifecycleHookNamesBlacklist,
    lastLifecycleHookName,
    awsRequestStubMap,
    modulesCacheStub,
    shouldStubSpawn,
    hooks = {},
  }
) =>
  new Promise((resolve) => {
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
    if (!cwd && !config) throw new TypeError("Either 'cwd' or 'config' option must be provided");
    if (cwd && config) {
      throw new TypeError("Expected either 'cwd' or 'config' options, not both of them");
    }
    if (config) {
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
    ensurePlainObject(hooks, {
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
      modulesCacheStub[
        cjsResolveSync(serverlessPath, 'child-process-ext/spawn').realPath
      ] = sinon.stub().resolves({});
    }
    resolve(
      resolveCwd({ cwd, config }).then((confirmedCwd) =>
        overrideEnv(
          { variables: Object.assign(resolveEnv(), env), whitelist: envWhitelist },
          () => {
            let stdoutData = '';
            return overrideCwd(confirmedCwd, () =>
              overrideArgv({ args: ['serverless', ...cliArgs] }, () =>
                overrideStdoutWrite(
                  (data) => (stdoutData += data),
                  () =>
                    resolveServerless(serverlessPath, modulesCacheStub, (Serverless) =>
                      Promise.resolve(
                        hooks.before && hooks.before(Serverless, { cwd: confirmedCwd })
                      ).then(() => {
                        // Intialize serverless instances in preconfigured environment
                        let serverless = new Serverless();
                        if (serverless.triggeredDeprecations) {
                          serverless.triggeredDeprecations.clear();
                        }
                        const pluginConstructorsBlacklist = pluginPathsBlacklist.map((pluginPath) =>
                          require(pluginPath)
                        );
                        return serverless.init().then(() => {
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
                          const unconfirmedLifecycleHookNames = new Set(
                            lifecycleHookNamesBlacklist
                          );
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
                              lastHook.hook = function () {
                                try {
                                  return Promise.resolve(hookFunction.call(this)).then(
                                    (result) => {
                                      hasLastHookFinalized = true;
                                      return result;
                                    },
                                    (error) => {
                                      hasLastHookFinalized = true;
                                      throw error;
                                    }
                                  );
                                } catch (error) {
                                  hasLastHookFinalized = true;
                                  throw error;
                                }
                              };
                              return eventHooks;
                            };
                          }

                          if (awsRequestStubMap) {
                            configureAwsRequestStub(
                              serverless.getProvider('aws'),
                              awsRequestStubMap
                            );
                          }

                          // Run plugin manager hooks
                          return serverless
                            .run()
                            .then(() => {
                              if (hooks.after) return hooks.after(serverless);
                              return null;
                            })
                            .then(() => {
                              const awsProvider = serverless.getProvider('aws');
                              return {
                                serverless,
                                stdoutData,
                                cfTemplate:
                                  serverless.service.provider.compiledCloudFormationTemplate,
                                awsNaming: awsProvider && awsProvider.naming,
                              };
                            });
                        });
                      })
                    )
                )
              )
            );
          }
        )
      )
    );
  });
