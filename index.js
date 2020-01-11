/**
 * Primary file for the API
 */

 // Dependencies
 const http = require('http');
 const url = require ('url'); // library for all things url

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

    // send the response
    res.end(`Hello World\n`);

    // Log the request path
    console.log(`Request received with these: `,headers);
});

 //start the server and have it listen on port 3000
 server.listen(3000, ()=> console.log(`The server is listening on port 3000!`));