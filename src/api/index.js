'use strict';

var express = require("express");
let plivo = require('plivo');
// var Todo = require("../models/todo");
//var todos = require("../../mock/todos.json");

var router = express.Router();
var callingNumbers;
var appStatus = false;
var phonePrefix = 40;
var reapelare = 0;
var reapelareRobot = 300000;
var balantaTotal;
var timpSunat = 10;

///////////////Functions//////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//Random number generator
function getRandom(length) {

    var math = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    var res = phonePrefix.toString() + math;
    return res;

} //end getRandom

    //Function random items
function random(accountsData) {
    var random = Math.floor(Math.random()*100);
    let item = accountsData[random];
    return {acc: item.authId, psw: item.authToken};
}; 
var randomAccount = new random(accountsData);
// end random function
//Function call
//https://api-reference.plivo.com/latest/node/resources/call/make-a-call
let callAgain = function(callingToNumber) {
    var math = getRandom(10);
    let randomAccount = new random(accountsData);
    let client = new plivo.Client(randomAccount.acc, randomAccount.psw);
    var params = {
        from: math,
        to: callingToNumber,
        answer_url: 'http://d10de098.ngrok.io/api/answer',
        answer_method: 'GET',
        ring_timeout: timpSunat,
        machine_detection: 'true',
        machine_detection_url: 'http://d10de098.ngrok.io/api/update',
        hangup_url: 'http://d10de098.ngrok.io/api/update'
    };

    client.calls.create(params.from, params.to, params.answer_url).then(function(call_created){
        console.log(call_created)
    }); //end call

}; //end function call again

//Function call check
let noAnswer = function (req, data, callStatus, appStatus, calledNumber){
    if (callStatus == 'no-answer' && appStatus == true) {
        callAgain(calledNumber);
        req.app.io.emit('noAnswerPhoneNumbers', {data});
    };
};

let callCompleted = function (req, data, callStatus, machine, appStatus, calledNumber){
    if (callStatus == 'completed' && machine !== 'true' && appStatus == true) {
        callAgain(calledNumber);
    };
};

let callCancel = function (req, data, callStatus, appStatus, calledNumber){
    if (callStatus == 'cancel' && appStatus == true) {
        callAgain(calledNumber);
    };
};

let callBusy = function (req, data, callStatus, appStatus, calledNumber){
    if (callStatus == 'busy' && appStatus == true) {
        callAgain(calledNumber);
        req.app.io.emit('busyPhoneNumbers', {data});
    };
};

let callTimeout = function (req, data, callStatus, appStatus, calledNumber){
    if (callStatus == 'timeout' && appStatus == true) {
        callAgain(calledNumber);
    };
};

let callMachineManual = function (req, data, timpApelare, timpRaspuns, machine, callStatus, appStatus, calledNumber){
    if (Date.parse(timpApelare) < Date.parse(timpRaspuns) - 4000 == true && machine == 'true' && callStatus == 'completed' && appStatus == true) {
        callAgain(calledNumber);
        req.app.io.emit('machineManual', {data});
    };
};

let callMachineAutomatic = function (req, data, timpApelare, timpRaspuns, machine, callStatus, appStatus, calledNumber, reapelareRobot){
    if (Date.parse(timpApelare) < Date.parse(timpRaspuns) - 1000 == true && machine == 'true' && callStatus == 'completed' && appStatus == true) {
        setTimeout(function() {
            callAgain(calledNumber);
        }, reapelareRobot);
        req.app.io.emit('machineAutomatic', {data});
    };
};

router.post('/call', function(req, res, next) {
    var data = req.body;
    var toCallNumbers = data.callNum;
    appStatus = data.appStatus;
    phonePrefix = data.callPrefix;
    reapelare = data.redial * 1000;
    reapelareRobot = data.machine * 1000;
    timpSunat = data.callRedial * 1000;
    console.log(data);
    for (var i = 0; i < toCallNumbers.length; i++) {

        callAgain(toCallNumbers[i]);

    }; //end loop
    res.send(req.body);
    next();
});
router.post('/update', function(req, res, next){
    let data = req.body;
    let totalCost = req.body.TotalCost;
    let direction = req.body.Direction;
    let duration = req.body.Duration;
    let calledNumber = req.body.To;
    let callStatus = req.body.CallStatus;
    let machine = req.body.Machine;
    let finalEvent = req.body.Event;
    let callId = req.body.CallUUID;
    let timpApelare = req.body.StartTime;
    let timpRaspuns = req.body.AnswerTime;
    console.log(data);
    console.log(data.CallStatus);
    console.log(phonePrefix + ' update pP');
    appStatus = data.appStatus;
    noAnswer(req, data, callStatus, appStatus, calledNumber);
    callCompleted(req, data, callStatus, machine, appStatus, calledNumber);
    callCancel(req, data, callStatus, appStatus, calledNumber);
    callBusy(req, data, callStatus, appStatus, calledNumber);
    callTimeout(req, data, callStatus, appStatus, calledNumber);
    callMachineManual(req, data, timpApelare, timpRaspuns, machine, callStatus, appStatus, calledNumber);
    callMachineAutomatic(req, data, timpApelare, timpRaspuns, machine, callStatus, appStatus, calledNumber, reapelareRobot);
    
    res.send('OK');
    next();
});

router.post('/stop', function(req, res, next){
    var data = req.body;
    appStatus = data.appStatus;
    console.log(appStatus);
    res.send('stop');
    next();
});

router.get('/answer', function(req, res, next) {

    var r = plivo.Response();
    var params = {
        'length': "55",
        'silence': "true",
        'minSilence': "55000"
    };
    r.addWait(params);
    res.set({
        'Content-Type': 'text/xml'
    });
    res.send(r.toXML());
    next();
});



module.exports = router;

