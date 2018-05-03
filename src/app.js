'use strict';
var express = require("express");
var dotenv = require("dotenv").config();
var router = require("./api/index");
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require("./models/user.model");
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
app.use(cookieParser());


app.use(session({
    secret: 'callapp',
    resave: true,
    saveUninitialized: false
  }));

app.use('/api', router);

app.use('/', function(req, res, next){
    User.findById(req.cookies.userId)
      .exec(function (error, user) {
        if (error) {
        //   return next(error);
        return res.status(401).sendFile(path.join(__dirname + '/api/views/login.html'));
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            // return next(err);
            return res.status(401).sendFile(path.join(__dirname + '/api/views/login.html'));
          } else {
            next();
          }
        }
      });
});
//static for DigitalOcean should be /root/public
app.use(express.static('/root/public'));



http.listen(port, function() {
    console.log('The server is listening on port ' + port);
});
