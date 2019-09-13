#### mocha-isolated

Runs each test file in new distinct node.js process, supports below options and test file patterns.

_Note: it doesn't support or passes through any options to Mocha. it is expected that they're secured at configuration file level_

##### _`--skip-fs-cleanup-check`_

Do not validate file system side effects (this also effectively turns on parallel test run, as file system validation to be reliable requires consecutive run)

##### _`--pass-through-aws-creds`_

Isolated tests by default are run with no (but mandatory a `PATH`) env variables, and that also includes eventual `AWS_*` env vars. This setting will ensure they're passed through
