/**
 * Primary file for the API
 */

 // Dependencies
 const http = require('http');
 const url = require('url'); // library for all things url
 const { StringDecoder } = require('string_decoder'); // library to decode string

 // The server should respond to all requests with a string
// create a server object
const server = http.createServer((req, res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true); // true => parse the query string too
    console.log(parsedUrl);

    // Get the path from the url
    const path = parsedUrl.pathname; // untrimmed path
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // remove the slashes from both ends

    // Get the query string as an object
    const queryStringObject = parsedUrl.query

    // Get the http method
    const method = req.method.toUpperCase();

    // Get the headers as a object
    const headers = req.headers;

    // Get the payload (body of the request), if any
    // payloads come in as a stream - a bit at a time.
    // collects the stream as it comes in and collate it at the end of the stream
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data)=> {
        buffer += decoder.write(data); // decoder turns the data to a string
    })
    // On end of the stream;
    req.on('end', ()=>{
        buffer += decoder.end();

        // choose handler to handle request
        const chosenHandler = (router[trimmedPath]) ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload)=>{
            // use the status code sent by the handler or default to 200
            statusCode = (statusCode) ? statusCode : 200

             // the payload here is the response object that we get back from the handler
            // if the payload exist use it or default payload to {}
            payload = (payload) ? payload : {}

            // convert the payload to a string;
            const payloadString = JSON.stringify(payload);

            //return response
            res.setHeader('content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
    
            // Log the request path
            console.log(`Returning this response: `,statusCode, payloadString);
        });
    });
    
});

 //start the server and have it listen on port 3000
 server.listen(3000, ()=> console.log(`The server is listening on port 3000!`));


// Define route handlers
const handlers = {};

// sample handler
handlers.sample = (data, callback) => {
    // callback a http status code and a payload
    callback(406, { 'name' : 'sample handler' })
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404)
};

 // Define a request router
const router = {
    'sample': handlers.sample
};