'use strict';
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/mean-todo', function(err) {
    if (err) {
        console.log('failed connecting to mondoDB');
    }
    else {
        console.log('successfully connected to mondoDB');
    }
});
