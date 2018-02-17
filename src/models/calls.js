'use strict';
var mongoose = require("mongoose");

var callsSchema = new mongoose.Schema({
    calledNumber: String,
    data: [{
        hangupCauses: String,
        duration: Number,
        callStatus: String,
        machine: Boolean,
        updated: { type: Date, default: Date.now }
    }]
});

var model = mongoose.model('Calls', callsSchema);

module.exports = model;
