'use strict';
var mongoose = require("mongoose");

var callsSchema = new mongoose.Schema({
    calledNumber: String,
    data: {
        hangupCauses: String,
        duration: Number,
        callStatus: String,
        machine: String,
        updated: { type: Date, default: Date.now }
    }
});


  callsSchema.query.byName = function(name) {
    return this.find({ name: new RegExp(name, 'i') });
};

var model = mongoose.model('Calls', callsSchema);
    
module.exports = model;
