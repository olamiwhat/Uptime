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
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          // create user object
          const userObj = {
            firstName,
            lastName,
            phone,
            password: hashedPassword,
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
    callback(400, { Error: 'Required fields are missing' });
  }
};

// users - get
// Required data: phone
// optional data: None
// @TODO only allow authenticated users access their own object
handlers._users.get = function (data, callback) {
  // check that the phone number provided is valid

  const { phone } = data.queryStringObject;

  if (phone && typeof (phone === 'string') && phone.trim().length === 10) {
    // look up user by phone
    _data.read('users', phone, (err, res) => {
      if (!err && res) {
        // remove the hashed password from the data
        delete res.password;
        callback(200, res);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
};

// users - put
// required data - phone
// optional data - first name, last name, password (at least one specified)
// @TODO only let an authenticated user updata their own object
handlers._users.put = function (data, callback) {
  const {
    phone, firstName, lastName, password,
  } = data.payload;

  if (phone && typeof (phone === 'string') && phone.trim().length === 10) {
    // check for optional data to update
    if ((lastName && typeof lastName === 'string' && lastName.trim().length > 0)
    || (firstName && typeof firstName === 'string' && firstName.trim().length > 0)
    || (password && typeof password === 'string' && password.trim().length > 0)) {
      // look user up
      _data.read('users', phone, (err, userData) => {
        if (!err && userData) {
          // update the necessary fields
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = helpers.hash(password);
          }
          // store the new updates
          _data.update('users', phone, userData, (err) => {
            if (!err) {
              callback(200, { success: 'Update Successful!' });
            } else {
              console.log(err);
              callback(500, { Error: 'could not update user' });
            }
          });
        } else {
          callback(400, { Error: 'The specified user does not exist' });
        }
      });
    } else {
      callback(400, { Error: 'Missing required fields to update' });
    }
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

// users - delete
// @TODO  - only let authenticated user delete their own object
handlers._users.delete = function (data, callback) {
  // retrieve phone from request payload
  const { phone } = data.payload;

  if (phone && typeof (phone === 'string') && phone.trim().length === 10) {
    // look up the user
    _data.read('users', phone, (err, userData) => {
      // if user exist, delete
      if (!err && userData) {
        _data.delete('users', phone, (err) => {
          // if delete is successful
          if (!err) {
            callback(200, { Success: 'User successfully deleted!' });
          } else {
            console.log(err);
            callback(500, { Error: 'Could not delete specified user' });
          }
        });
      } else {
        callback(400, { Error: 'User not found!' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required field' });
  }
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
