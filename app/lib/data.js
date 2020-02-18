/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// container for the module (to be exported)
const lib = {};


// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = function (dir, file, data, callback) {
  // Open the file for writing
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
};


lib.read = function (dir, file, callback) {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};


lib.update = function (dir, file, data, callback) {
  // open the file for writing
  fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('error closing the file');
                }
              });
            } else {
              callback('error writing to existing file, this is the error');
            }
          });
        } else {
          callback('error truncating file');
        }
      });
    } else {
      callback('no file of such exist');
    }
  });
};


lib.delete = function (dir, file, callback) {
  // unlink the file
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
};


// Export the module
module.exports = lib;
