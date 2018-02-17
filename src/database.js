'use strict';
var mongoose = require("mongoose");
mongoose.connect('mongodb://usercalls:parola123@ds237848.mlab.com:37848/calldb', function(err) {
    if (err) {
        console.log('failed connecting to mondoDB');
    }
    else {
        console.log('successfully connected to mondoDB');
    }
});
