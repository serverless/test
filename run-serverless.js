'use strict';

const ensureString = require('type/string/ensure');
const ensureIterable = require('type/iterable/ensure');
const ensurePlainObject = require('type/plain-object/ensure');
const ensurePlainFunction = require('type/plain-function/ensure');
const { writeJson } = require('fs-extra');
const { entries, values } = require('lodash');
const path = require('path');
const overrideEnv = require('process-utils/override-env');
const overrideCwd = require('process-utils/override-cwd');
const overrideArgv = require('process-utils/override-argv');
const disableServerlessStatsRequests = require('./disable-serverless-stats-requests');
const provisionTmpDir = require('./provision-tmp-dir');

const resolveServerless = (serverlessPath, modulesCacheStub, callback) => {
  if (!modulesCacheStub) {
    disableServerlessStatsRequests(serverlessPath);
    return callback(require(serverlessPath));
  }
  const originalCache = Object.assign({}, require.cache);
  for (const key of Object.keys(require.cache)) delete require.cache[key];
  disableServerlessStatsRequests(serverlessPath);
  for (const [key, value] of entries(modulesCacheStub)) require.cache[key] = { exports: value };

  const restore = () => {
    for (const key of Object.keys(require.cache)) delete require.cache[key];
    Object.assign(require.cache, originalCache);
  };
  try {
    return callback(require(serverlessPath)).then(
      result => {
        restore();
        return result;
      },
      error => {
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
  new Promise(resolve => {
    if (cwd) return resolve(cwd);
    return resolve(
      provisionTmpDir().then(tmpDirPath =>
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
    pluginPathsWhitelist,
    lifecycleHookNamesWhitelist,
    modulesCacheStub,
    hooks = {},
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
  if (!cwd && !config) throw new TypeError("Either 'cwd' or 'config' option must be provided");
  if (cwd && config) {
    throw new TypeError("Expected either 'cwd' or 'config' options, not both of them");
  }
  cliArgs = ensureIterable(cliArgs, {
    default: [],
    ensureItem: ensureString,
    errorMessage: 'Expected `cliArgs` to be a string collection, received %v',
  });
  pluginPathsWhitelist = ensureIterable(pluginPathsWhitelist, {
    denyEmpty: true,
    ensureItem: pluginPath =>
      require.resolve(path.resolve(serverlessPath, ensureString(pluginPath))),
    errorMessage:
      'Expected `pluginPathsWhitelist` to be a non empty, valid plugin paths collection,' +
      ' received %v',
  });
  lifecycleHookNamesWhitelist = ensureIterable(lifecycleHookNamesWhitelist, {
    denyEmpty: true,
    ensureItem: ensureString,
    errorMessage:
      'Expected `lifecycleHookNamesWhitelist` to be a non empty string collection, received %v',
  });
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
    default: [],
    ensureItem: ensureString,
    errorMessage: 'Expected `envWhitelist` to be a var names collection, received %v',
  });
  return resolveCwd({ cwd, config }).then(confirmedCwd =>
    overrideEnv(originalEnv => {
      if (originalEnv.APPDATA) process.env.APPDATA = originalEnv.APPDATA; // Needed on Windows
      for (const envVarName of envWhitelist) {
        if (originalEnv[envVarName]) process.env[envVarName] = originalEnv[envVarName];
      }
      Object.assign(process.env, env);
      return overrideCwd(confirmedCwd, () =>
        overrideArgv({ args: ['serverless', ...cliArgs] }, () =>
          resolveServerless(serverlessPath, modulesCacheStub, Serverless =>
            Promise.resolve(hooks.before && hooks.before()).then(() => {
              // Intialize serverless instances in preconfigured environment
              const serverless = new Serverless();
              const { pluginManager } = serverless;
              const pluginConstructorsWhitelist = pluginPathsWhitelist.map(pluginPath =>
                require(pluginPath)
              );
              return serverless.init().then(() => {
                // Strip registered hooks, so only those intended are executed
                const whitelistedPlugins = pluginManager.plugins.filter(plugin =>
                  pluginConstructorsWhitelist.some(Plugin => plugin instanceof Plugin)
                );
                for (const [index, Plugin] of pluginConstructorsWhitelist.entries()) {
                  if (!whitelistedPlugins.some(plugin => plugin instanceof Plugin)) {
                    throw new Error(
                      `Didn't resolve a plugin instance for ${pluginPathsWhitelist[index]}`
                    );
                  }
                }

                const { hooks: lifecycleHooks } = pluginManager;
                const unconfirmedLifecycleHookNames = new Set(lifecycleHookNamesWhitelist);
                const notExecutedLifecycleHookNames = new Set(lifecycleHookNamesWhitelist);
                for (const hookName of Object.keys(lifecycleHooks)) {
                  if (!lifecycleHookNamesWhitelist.includes(hookName)) {
                    delete lifecycleHooks[hookName];
                    continue;
                  }

                  lifecycleHooks[hookName] = lifecycleHooks[hookName].filter(hookData => {
                    if (
                      !whitelistedPlugins.some(whitelistedPlugin =>
                        values(whitelistedPlugin.hooks).includes(hookData.hook)
                      )
                    ) {
                      return false;
                    }
                    const originalHook = hookData.hook;
                    hookData.hook = function(...args) {
                      notExecutedLifecycleHookNames.delete(hookName);
                      return originalHook.apply(this, args);
                    };
                    return true;
                  });

                  if (lifecycleHooks[hookName].length) {
                    unconfirmedLifecycleHookNames.delete(hookName);
                  }
                }
                if (unconfirmedLifecycleHookNames.size) {
                  throw new Error(
                    `${Array.from(unconfirmedLifecycleHookNames).join(
                      ', '
                    )} whitelisted lifecycle hook names were not recognized ` +
                      'in scope of whitelisted plugins'
                  );
                }

                // Run plugin manager hooks
                return serverless
                  .run()
                  .then(() => {
                    if (notExecutedLifecycleHookNames.size) {
                      throw new Error(
                        `${Array.from(unconfirmedLifecycleHookNames).join(
                          ', '
                        )} whitelisted lifecycle hooks were not executed. ` +
                          'Ensure to enforce desired serverless command via `cliArgs` option.'
                      );
                    }
                    if (hooks.after) return hooks.after(serverless);
                    return null;
                  })
                  .then(() => serverless);
              });
            })
          )
        )
      );
    })
  );
};
