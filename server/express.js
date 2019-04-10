/*
    Setup express
*/

// Imports
const express = require('express'), path = require('path'), bodyParser = require('body-parser');

// Express server
let server = express();

// Public folder
server.use(express.static(path.resolve(__dirname, 'assets')));

// Body parser
server.use(bodyParser.json());

// Return our server
module.exports = server;