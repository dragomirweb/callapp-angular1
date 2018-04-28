'use strict';
var express = require("express");
var dotenv = require("dotenv").config();
var path = require("path");
var router = require("./api/index");
var jwt = require('express-jwt');
var unless = require('express-unless');
var bodyParser = require('body-parser');
var socket_io  = require('socket.io');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.io = io;

require("./database");
// require("./seed");

io.on('connection', function(socket){
    console.log('a user connected');

  });
//Default port for app is 80
var port = 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router);

app.use(jwt({ secret: 'callapp',credentialsRequired: true}).unless({path: ['/api']}));
app.use(function (err, req, res, next) {
    console.log(req)
    if (err.name === 'UnauthorizedError') {
        if(req.path !== '/signin'){
            res.redirect('/signin');
            res.send(req);
        } else {
            res.status(401).sendFile(path.join(__dirname + '/views/login.html'));
        }
    }
  });

//static for DigitalOcean should be /root/public
app.use('/', express.static('public'));


http.listen(port, function() {
    console.log('The server is listening on port ' + port);
});
