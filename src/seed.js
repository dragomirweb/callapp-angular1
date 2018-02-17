'use strict';

var calls = require("./models/calls.js");

var numbers = [
    '+407',
    '+408',
    '+407'
];

numbers.forEach(function(number, index) {
    calls.find({
        'calledNumber': number
    }, function(err, numbers) {
        if (!err && !numbers.length) {
            calls.create({
                calledNumber: number,
                data: [{
                    hangupCauses: 'NO_ANSWER',
                    duration: 30,
                    callStatus: 'Hangup',
                    machine: false
                }]
            });
        }
    });
});
