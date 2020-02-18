/* eslint-disable no-use-before-define */
/**
 * Primary file for the API
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url'); // library for all things url
const { StringDecoder } = require('string_decoder'); // library to decode string
const fs = require('fs');
const config = require('./config');


// The server should respond to all http requests with a string
// create a server object
const httpServer = http.createServer((req, res) => {
  // pass in the server logic to handle the request
  unifiedServer(req, res);
});

// Have the http server listen on the port based on the environment
httpServer.listen(config.httpPort, () => console.log('The server is listening on port:', config.httpPort));

// pass the keys as options to the https server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

// The server should respond to all https requests with a string
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Have the https server listen on the port based on the environment
httpsServer.listen(config.httpsPort, () => console.log('The server is listening on port:', config.httpsPort));

// Server logic for both http and https server
const unifiedServer = (req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true); // true => parse the query string too
  console.log(parsedUrl);

  // Get the path from the url
  const path = parsedUrl.pathname; // untrimmed path
  const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // remove the slashes from both ends

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the http method
  const method = req.method.toUpperCase();

  // Get the headers as a object
  const { headers } = req;

  // Get the payload (body of the request), if any
  // payloads come in as a stream - a bit at a time.
  // collects the stream as it comes in and collate it at the end of the stream
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data); // decoder turns the data to a string
  });
  // On end of the stream;
  req.on('end', () => {
    buffer += decoder.end();

    // choose handler to handle request
    const chosenHandler = (router[trimmedPath]) ? router[trimmedPath] : handlers.notFound;

    // construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // use the status code sent by the handler or default to 200
      statusCode = (statusCode) || 200;

      // the payload here is the response object that we get back from the handler
      // if the payload exist use it or default payload to {}
      payload = (payload) || {};

      // convert the payload to a string;
      const payloadString = JSON.stringify(payload);

      // return response
      res.setHeader('content-Type', 'application/json'); // => responds with json data
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString);
    });
  });
};


// Define route handlers
const handlers = {};

// ping handler => just to ping the monitor the app and find out if it's still alive
handlers.ping = (data, callback) => {
  // callback a http status code and a payload => no payload required here
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  ping: handlers.ping,
};
