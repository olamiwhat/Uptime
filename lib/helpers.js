/**
 * helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// container for all the helpers
const helpers = {};

// create a SHA256 hash
helpers.hash = function (str) {
  if (typeof (str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  return false;
};

// parse a JSON string to an object in all cases, without throwing an error
helpers.parseJSONtoObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Export the module
module.exports = helpers;
