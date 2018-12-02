const storage = require('electron-json-storage');

/**
 * Promise to return login token from json storage if exists
 */
const getToken = function() {
  return new Promise(function(resolve, reject) {
    storage.get('token', function(error, data) {
      if (data.token) {
        resolve(data.token);
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Promise to set login token in json storage
 * @param {string} token Login token to be set
 */
const setToken = function(token) {
  return new Promise(function(resolve, reject) {
    storage.set('token', { 'token': token }, () => {
      resolve();
    });
  });
};

/**
 * Promise to delete login token from json storage
 * @param {string} token Login token to be deleted
 */
const deleteToken = function(token) {
    return new Promise(function(resolve, reject) {
        storage.remove('token', function(error) {
            resolve();
        });
    });
}

/**
 * CONST for Host Prefix for REST API Requests
 */
const hostUrlForRequests = 'http://localhost:8080/my-project/public/';

module.exports = { 
  getToken,
  setToken,
  hostUrlForRequests,
  deleteToken,
};

