const request = require('request');
const { getToken } = require('./../settings');

/**
 * Execute POST Request with or without login token as header (if exists)
 * @param {string} token Login token to be passed as header
 * @param {string} requestUrl Url on which the request ist executed
 * @param {function} callback Function to to be executed after successful request (response of request as param)
 */
const performRequest = function(token, dataToSend, requestUrl, callback) {
  const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (token) {
    header.token = token;
    request({
      method: 'POST',
      url: requestUrl,
      form: dataToSend,
      headers: header,
    },
    function (err, res, body) {
      callback(body);
    });
  } else {
    request({
      method: 'POST',
      url: requestUrl,
      form: dataToSend,
      headers: header,
    },
    function(err, res, body) {
      callback(body);
    });
  }
}

/**
 * Check for login token and then executes POST request
 * @param {string} requestUrl Url on which the request ist executed
 * @param {function} callback Function to to be executed after successful request (response of request as param)
 */
const postRequest = function (dataToSend, requestUrl, callback) {
  getToken().then(
    (token) => {
      performRequest(token, dataToSend, requestUrl, callback);
    }
  );
};

module.exports = {
  postRequest,
};
