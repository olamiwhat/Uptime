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

    // Get the path from the url
    const path = parsedUrl.pathname; // untrimmed path
    const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // remove the slashes from both ends

    // Get the http method
    const method = req.method.toUpperCase();

    // send the response
    res.end(`Hello World\n`);

    // Log the request path
    console.log(`Request received on path: `, trimmedPath, `method: `, method);
});

 //start the server and have it listen on port 3000
 server.listen(3000, ()=> console.log(`The server is listening on port 3000!`));