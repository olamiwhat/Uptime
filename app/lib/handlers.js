/**
 * Request Handlers
 */


// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define route handlers
const handlers = {};

// users - check that method is acceptable method
handlers.users = function (data, callback) {
  const method = data.method.toLowerCase();
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(method) > -1) {
    handlers._users[method](data, callback);
  } else {
    callback(405);
  }
};

// container for the users sub-methods
handlers._users = {};

// users - post
// Required data: firstname, lastname, phone, password, tosAgreement
// optional data: none
handlers._users.post = function (data, callback) {
  // check that all required fields are filled out
  console.log('data:', data.payload);

  const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
  const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
  const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;
  const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;
  const tosAgreement = !!(typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true);

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure user doesn't already exist
    _data.read('users', phone, (err, data) => {
      // if there is an error that means the user does not exist
      if (err) {
        // hash the password
        const hashPassword = helpers.hash(password);

        if (hashPassword) {
          // create user object
          const userObj = {
            firstName,
            lastName,
            phone,
            password: hashPassword,
            tosAgreement: true,
          };

          // store user
          _data.create('users', phone, userObj, (err) => {
            if (!err) {
              callback(200, { Success: `User - '${firstName}' was successfully created` });
            } else {
              console.log(err);
              callback(500, { Error: 'Could not create the new user' });
            }
          });
        }
      } else {
        // user already exists
        callback(400, { Error: 'A user with that phone number already exists' });
      }
    });
  } else {
    callback(400, { Error: `Required fields are missing check - ${(!firstName) ? 'first Name' : (!lastName) ? 'Last Name' : 'others'}` });
  }
};

// users - get
handlers._users.get = function (data, callback) {

};

// users - put
handlers._users.put = function (data, callback) {

};

// users - delete
handlers._users.delete = function (data, callback) {

};

// ping handler => just to ping the monitor the app and find out if it's still alive
handlers.ping = (data, callback) => {
  // callback a http status code and a payload => no payload required here
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};


// Export modules
module.exports = handlers;
