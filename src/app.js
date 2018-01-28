'use strict';
var express = require("express");
var dotenv = require("dotenv").config();
var router = require("./api/index");
var bodyParser = require('body-parser');
var socket_io  = require('socket.io');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.io = io;

io.on('connection', function(socket){
    console.log('a user connected');

  });
var port = 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static('public'));
app.use('/api', router);



http.listen(port, function() {
    console.log('The server is listening on port ' + port);
});
