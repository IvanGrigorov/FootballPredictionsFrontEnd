const { getToken } = require('./../settings');
const request = require('request');

/**
 * Execute GET Request with or without login token as header (if exists)
 * @param {string} token Login token to be passed as header
 * @param {string} requestUrl Url on which the request ist executed
 * @param {function} callback Function to to be executed after successful request (response of request as param)
 */
const performRequest = function(token, requestUrl, callback) {
  if (token) {
    request({
      url: requestUrl,
      method: 'GET',
      headers: { 'token' : token },
    },
    function (err, res, body) {
      callback(body);
    });
  } else {
    request({
      url: requestUrl,
      method: 'GET',
    },
    function(err, res, body) {
      callback(body);
    });
  }
}

/**
 * Check for login token and then executes GET request
 * @param {string} requestUrl Url on which the request ist executed
 * @param {function} callback Function to to be executed after successful request (response of request as param)
 */

const getRequest = function (requestUrl, callback) {
  getToken().then(
    (token) => {
      performRequest(token, requestUrl, callback);
    }
  );
};

module.exports = {
  getRequest,
};
