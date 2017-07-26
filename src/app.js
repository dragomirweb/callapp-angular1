'use strict';
var express = require("express");
var dotenv = require("dotenv").config();
var router = require("./api/index");
var bodyParser = require('body-parser');

var app = express();

require("./database");
require("./seed");
var port = process.env.PORT;

app.use(bodyParser.json());
app.use('/', express.static('public'));
app.use('/api', router);

app.listen(port, function() {
    console.log('The server is listening on port ' + port);
});
