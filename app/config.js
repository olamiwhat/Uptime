/**
 * Create and export configuration variables
 */

 // container for all the environments
 const environments = {};

 // create staging env
 environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
 };

 //create prod env
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};

// Determine which env was passed as a command-line argument
const currentEnvironment = (process.env.NODE_ENV) ? process.env.NODE_ENV : '';

// check that the current environment is one of the environment above
// otherwise default to staging
const environmentToExport = (environments[currentEnvironment]) ? environments[currentEnvironment] : environments.staging

// Export the module
module.exports = environmentToExport;