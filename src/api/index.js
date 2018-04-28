

var express = require("express");
let plivo = require('plivo');
var path = require('path');
var session = require('express-session');

var calls = require("../models/calls");
var User = require("../models/user.model");
const query = calls.find();


var router = express.Router();
var callingNumbers;
var appStatus = false;
var phonePrefix = "+40";
var phonePrefixLength = 8;
var reapelareRobot = 300;
var balantaTotal;
var timpSunat = 10;

///////////////Functions//////////////////
//Random number generator
function getRandom(phonePrefixLength) {

    let math = Math.floor(Math.pow(10, phonePrefixLength - 1) + Math.random() * 9 * Math.pow(10, phonePrefixLength - 1));
    let res = phonePrefix.toString() + math;
    return res;

} //end getRandom
var accountsData = [
    {authId: 'SAN2JLZWJIZDA1MJDKNG', authToken: 'NmY3ZTBjYjE3MTVhYmMzZGFkNWNiYzAwOWE2MjQ3'},
    {authId: 'SAZDU1YTNMZMZIMWEXNW', authToken: 'YjRhMzJmZWY2N2U5OTdmMzY3Mzk1OWM4NDI5NDM1'},
    {authId: 'SANJG0MJKXMTG4NTBHMD', authToken: 'ODliMWZiYmUxNDEzOWRlNjYxMTYwMDEzNmY1N2Yz'},
    {authId: 'SANMZMNGE5ZMFHMDZIMM', authToken: 'YzJhMmUzOTE2MzMzNTdjZDYxZTY4NTRjNTliZDky'},
    {authId: 'SAN2I4YTCWNZJMMZG0YZ', authToken: 'ZTc4ZWFlYjZiMDc1YmFlODNkOTE4MDIxYmU0Yjk0'},
    {authId: 'SANTG2ZTVJMJRLMZZHMW', authToken: 'ODY0ZTBmZDRhNDE5YTg1MTlmZDBlNTBiNGNhOWRl'},
    {authId: 'SAZJHMNTQXMZYYYZC0YZ', authToken: 'YmEyNGU2YjBiN2I0MDgzODExYzMwNDA4MjlkMDNh'},
    {authId: 'SAYTU3YZE3MDJMMWJIY2', authToken: 'MDUwZGIzMzcxMzA4NDNiYzNhNThkYmRiNDUxZGI5'},
    {authId: 'SANDE1MZRHNDYXODIXNJ', authToken: 'OGM1NzQ5NWIxMzIxMDRmOGNmMmMxNzU1NDhhYjYx'},
    {authId: 'SANMQ5OWUXN2Q3MTCXNZ', authToken: 'ZWY4OTg3MDQyMzE0NzgxZjMxYTYzYThlYTEyMTky'},
    {authId: 'SANZGXYTRLZDVJMGUXOD', authToken: 'ZjcxMmM2MmY0OGU5MjNiYjU0OWM5NmFlYzE1YzQ4'},
    {authId: 'SANJFLYJQZYME2M2NLNW', authToken: 'MmVkY2NkZTM1OTFmZjExYjZlYmUxMzc1OTc5Njhl'},
    {authId: 'SAMWNKMDI4YZRMZDDHZJ', authToken: 'YjlmYWNmZmU3YTVjZWNiYzUwZDFiZmYyNmQ3NmRl'},
    {authId: 'SAZGVJNJYWNZKZMZVIYT', authToken: 'MWNkOTVmOGQ5MmNhYWRiNjJjNWZiMTA4ODdkMWNl'},
    {authId: 'SAMDEZYTUYOTQ1OTJKMZ', authToken: 'YmE1MzA0N2VlN2ZlOTFhODcyZDkyNGMzZmY0MjYy'},
    {authId: 'SAYWIYYTE4OTE2ZJC2NT', authToken: 'MDUwNDI4OTFjNzRhMmNmMWZhY2JlZDdlOGRjNDcw'},
    {authId: 'SAOWRJYWM4YTUYY2QYNT', authToken: 'ZDhhMDFlMmRhNWI0ZGEyNDlkMmI5OWQ2ODNjOTVi'},
    {authId: 'SANWYYNMI3MME4ZDG0MW', authToken: 'MTk4YjZmNzU0OWIwMmEyYWRlNjI2MTExYWVmMDFi'},
    {authId: 'SAZWRMNMM0MZA4NDUWOG', authToken: 'NTk1NWUzODhlZTVjZTY2NzAxNDkxZjBhYTJhOTg1'},
    {authId: 'SAMZKZNDG4NDHLZDA1YJ', authToken: 'N2Q5YTE5ZmNlMGEwYWY5NTI5NjU1M2IzODgzYzgw'},
    {authId: 'SAMWRLY2YXMZYYNDC5MW', authToken: 'YmNlMDAxOGQzMTBjZGRhZDA0MWU4MDhlMDI0ZDk1'},
    {authId: 'SAOTVHNJEYMJNJMJNMMZ', authToken: 'OGY3ZmZmNWQyOTNkYjk0YWI1M2M5YmU3NjZjZTBh'},
    {authId: 'SAM2I2NDVLNMRLMJC2YT', authToken: 'MTM0Njk5YzRhOTY1MDM4NDEwNjZiOTdkNzk1Y2Nm'},
    {authId: 'SANJHHNGY0ODZJOTG3NJ', authToken: 'MzA5OTYzMTc0YjI4YWEzOWI0OTQ1NjM0NDExNWZm'},
    {authId: 'SAMTZIMDYYYZVMZDLHYM', authToken: 'MGRlM2VjZTNhZGIyMzZhNzE2ZTZlMTU3NGRiNzNj'},
    {authId: 'SANWFHYJC3ZDG5OGM3ZD', authToken: 'ZjhmZDJhYmQwNWQwZWVlNDU1ZTViZTVjMDAwMjMx'},
    {authId: 'SAZTHIMZHMZWU4YTNJNZ', authToken: 'YWY0NmZlZmU1ZTBiZGZkMmQzM2EzYjhjNzUxMjVh'},
    {authId: 'SAYZK1OGQXMJM3YZU1ZM', authToken: 'OTBmYmRkNGNjMDM2YjI4NGQ2ZTZiNzg3Mjc1ZjI3'},
    {authId: 'SAMTEYN2U2OTM3ZWRIMJ', authToken: 'NDhiZTUwZTY0NjJiNDZhMDIzYTA0YjhiMGZiY2E3'},
    {authId: 'SANDZJNTDLYMNINDRIZM', authToken: 'NzU4YzJjMGYxNDVjOTNjZWY1ZDIxYmIwYjM0Zjcy'},
    {authId: 'SAMZZJNMY3ZDIZOGI2YM', authToken: 'ZjQwNDJlYzk5NGUzMWQyNWQ2MTI1MjBhMTFjYmU1'},
    {authId: 'SANDM1OWQWMZK2ZTUZZT', authToken: 'MWNjYzZkZDU0MjA1NmUzYTA5Zjk3ODJkYjZlMjlh'},
    {authId: 'SAYJCXODDIMGYZNGEZMM', authToken: 'NTBlMzA3MjljYWI3MTBhMDg0MTEwYjM2YTBiOWQy'},
    {authId: 'SAMDJLNJE3YTIXMTC1YT', authToken: 'MjQ5MGYzM2FlNDQ2NTQ5NWQ5MjUzNDExNTkzOWQ4'},
    {authId: 'SAZDI1NTFKMTKYYWFMOW', authToken: 'Y2I1ZjI2MmMyMGM1M2QwYTI1NmQxYWE3ZTE2NTYz'},
    {authId: 'SAN2I2MDQ0NWM5NTA0NZ', authToken: 'NTQ2OTYxMTNlNjFiOWY0NzM5ODEyM2E2YzliMTIz'},
    {authId: 'SAMTE3YTMYNDHJNWE1OD', authToken: 'MjgyNzRkZjcwYjQ5YWEzYzJmMjkyYmYzMzY1NmQ0'},
    {authId: 'SANTCYODLMYWY1NMI4NG', authToken: 'NDgzODM3ZTcxZjMzMGE4ZjExMTcwZTY5ZDg4NDQ5'},
    {authId: 'SAOWE5MGQ1MJC1YJMXOD', authToken: 'NDdlOGQyMmZkNGMzMWMzNzZkZjk2ZDExZmFkZmFk'},
    {authId: 'SAMMZMZWNMYJEYYTQ1YM', authToken: 'YTMzODkwOThkMjYxYTM2MzVmMTU1YzE3ZGJmOTBk'},
    {authId: 'SAMJFJYJM5YZAYYZC5MD', authToken: 'MDk5NDlmOGNkZTA3NTZiMGI0ZTk5MjM5YzVlYTJi'},
    {authId: 'SANTRHZJG0MZC1NJQ3ZD', authToken: 'NjgwODFlZTFjY2YyZmI3N2NjNDJhZTY3ZTQ3YjE3'},
    {authId: 'SAZTRKOWMWZJMYNDKXMJ', authToken: 'ZDcwY2UzY2FkODQ2M2M3ZDU1OWE3ODM2ZTM2YmMy'},
    {authId: 'SAOTVKZDNHMJE5YTRKYJ', authToken: 'ODgxNzQ1M2ViM2YzMjlhZTBmOTI1NTBlY2ZjZGNl'},
    {authId: 'SAMTGXMDKZYWZHZMUWOD', authToken: 'MDEzYjI0YmQxNGY3MzhkMzc5NjM0MjU2N2E2NGE3'},
    {authId: 'SAMJZJZGMYYWMXNJBKM2', authToken: 'YjZiYmI3ZDQ5MWM3NDBjNjVkZGYyM2U4MjZjNzhk'},
    {authId: 'SAOTFLNDKWOTI1MDDKNW', authToken: 'YzI1Mzk4ZjlkZTg4ZjhjOGMxNTYxMjEzZTdhZDNj'},
    {authId: 'SAZTY1Y2U4NZAZMWZMOW', authToken: 'MWE5MmRjMDcyNzFlN2VjODI0NTliZGQ5MzYxZmQz'},
    {authId: 'SANGI1MTEYNMU0ZTI3MT', authToken: 'NzBhNzZhZWQ4YjRhYzU2Nzg1MjI1MzZhYTg0MzVl'},
    {authId: 'SAMZQ3NMVHMTBKMMRMNT', authToken: 'ZWRkYWI1MDc2MTljZDQyYmE1MzA4NTVlNjg0ZWI0'},
    {authId: 'SANDMXYZDKYJZIMWZHOD', authToken: 'NmIxMWFjOTNmOGVkMmE1YzU1MzhiYTBlNjM5ZTdm'},
    {authId: 'SAODHIZGMZNTI5NJUWNT', authToken: 'ZWE3MTdjMDZiZGYwY2YwOWU4NjdiOGY4N2U4Yjk5'},
    {authId: 'SAMDZIZJNKNWIZOTC4ND', authToken: 'ZDkxOTNjNDJmYTExN2E5ZWViMjk3MTljMzllODdl'},
    {authId: 'SAYZQWODZHMWYXYWNIMW', authToken: 'ZDkzNzI3YTA3ZDhlNTg5NGVjM2M2Y2RiYjAxYWMx'},
    {authId: 'SAMZFKYJNMMDA4OGVHZG', authToken: 'YmU4YmFjYmUwZjdmZDg5NzIzNWEyNjliNzJlM2Qx'},
    {authId: 'SAZMQ4YTFMNGNKM2EZNG', authToken: 'NzY0YTlhYzZiMTEzNjc4MDkzNDgxMjMzMzRiYTQ5'},
    {authId: 'SAMTM1ZJC3MTHLYTM5ZT', authToken: 'OGM4MzkxMGNhYmJkMDVmN2ZmOWU0MzAxYjJlNmU4'},
    {authId: 'SAMGVLZMQWMJM4YJUYNM', authToken: 'MmIyODE0NDZhODg2ZmVmNmE2MmU0ZmQ3MWU5MmRl'},
    {authId: 'SAYTY1OTA1YWU3YZE1YT', authToken: 'NTNmY2NmNTBhOGQ0ZjViOTM1YjBlYTg0OTIxZTNl'},
    {authId: 'SANWRHYJRKYMY1MDHLNZ', authToken: 'OGVhOWVhNzVjZGYyYjRjN2ZhOWY3YjY0YTg1OTdl'},
    {authId: 'SAMGE5ZMYXNTK1MZKWYW', authToken: 'MjJiOWE2Y2E3YTAzNWFlN2E4N2E3NDNiMDU3YjJj'},
    {authId: 'SAYWI0NZAZMDLKMJZINZ', authToken: 'OTJiOGE1ZTU1MWY2MWU2OThlZGRhMTc1NDI4ODNh'},
    {authId: 'SAODYYZJIYODJJNGIWMD', authToken: 'NGE3ZjIwMTgzNzYxYzNjYTM4ZmJhZmVlODBlNWM0'},
    {authId: 'SAOTQ5NMU1YZJMOGJKOD', authToken: 'OTIyMzJhMjViM2VhMzQ3NjY3MTY1MTM2YzJkZTVk'},
    {authId: 'SAMJI4ODQ3NMYZYTYWNG', authToken: 'YTZhNWU0ZjEwMTllODRhNjdiYzgwYWMwNzQyODI5'},
    {authId: 'SAZJFLMDHHZWJIYJI5NZ', authToken: 'MzJmMTY0ZTc2YzM5OGFjYzViZDE1ZTA5OTFlNGEx'},
    {authId: 'SAYZU4YJDHZJI5YWQZZD', authToken: 'MWQ4ZmZjMzU2M2U4MGRhZTFmNGVmZjc5MjU5ZTY3'},
    {authId: 'SAYTG5MJG1YTYXMDHJYW', authToken: 'ZDFkZjEzMTMwNWZhMWRkZWViYTRiNzUyMzFjMGZj'},
    {authId: 'SAZMM1NTM2MDHMOTI3ZG', authToken: 'ODM1NGIyNDIzOTU4OWQyOWM2ZjhhYjc1NWM0YWMy'},
    {authId: 'SANGMWZDA1MMY2NTJIYJ', authToken: 'YTdmN2RiMGYzYjMzZjM1OTMwMTcxYzdiMWM1NGNj'},
    {authId: 'SAOGVLZDRINZQZNDNJYJ', authToken: 'ZWE5MDVmNTFlMjFjN2EyZDllMWE2MzcyODJiZTRh'},
    {authId: 'SAYJY4NME1NMM3Y2I3OT', authToken: 'MGVjNDA5YTgwMDI4ZDZkZjM5N2E3NjZiZWZlMzcz'},
    {authId: 'SAZWI2MMY3NTY0OTNLNW', authToken: 'N2ZlNWU2MTBiZGRmNDY0ZjhmMmJiMzEyMjVmYjE4'},
    {authId: 'SAM2E3MTE3NDI4NDRMND', authToken: 'MDZkYzQ5MDI4ZjI3NzY0ZjcwYzA1NWFhZDUyZGRh'},
    {authId: 'SANTAZYTVJZJI2YWI4YJ', authToken: 'NDRkMTdhMjQ4NjlhMTMxNmFkOTM0OTRmMDI5NGRi'},
    {authId: 'SANMQ1YZNHNTGWODM0YT', authToken: 'ZDRiZDgzYzc0N2M3YmRjNzBmMmU4OGY1YjllOTgy'},
    {authId: 'SAZDUWYJI1YZJLNZY0OT', authToken: 'MDc2ODVmMjg2MDBlYzgzYjI0OTc4MmQ2YzFmYjZm'},
    {authId: 'SANWM5OWM5YJMWYZIYOW', authToken: 'MzNlNmQ4YzRlOWI1YThhM2ZhYWJiMjFhNDVkYTVj'},
    {authId: 'SAMJA2NZZMZGE2YMRHZD', authToken: 'MzBhZjU4MjRlZWIxMTcxNGIyNDkwNTBkZmMwNDUy'},
    {authId: 'SANTFIOTI4MTA4MZVJMJ', authToken: 'MTY5MGZjZDA0ZTg5MzVjYTA1NGQ3ZDNmMmRhY2Zi'},
    {authId: 'SAYTVJNMVKMDBIMDY2MG', authToken: 'ZDUwODU3OGI2NjQ3NGViODgwZTg0MzI0Y2VhY2Qw'},
    {authId: 'SAMJZKNTKXZWE4YZJMOW', authToken: 'Y2Y3NTc5MDc4MGI0OTcxMGM1NjBlMzhjNWMxYWU0'},
    {authId: 'SAMDVJNMFIZWNMYZZIMZ', authToken: 'NjFmZTAzZmJkOGZmNjNmNTA0NWE2Njk3MzViOTg0'},
    {authId: 'SAYTK5MMRLNTUZMJA0NM', authToken: 'MTNlNjcxNGQ4ZmI1ZTFiZGQ3YzY0MTBiZWE1ZWVl'},
    {authId: 'SAMGY2OWU4NZA1ZJEZNW', authToken: 'NDY1YmRlNjI2M2FkMDlhMDdjMWQ4ZjU1NDMwNmQx'},
    {authId: 'SANDK1OTDKNTDHNGI1MD', authToken: 'ZGYxNWQwNzZkY2YwZWU3ZWI5ZmM5YjkyMWYyNjE3'},
    {authId: 'SANZG2NZE2ODYWYWQ5YM', authToken: 'MTc4ZDIwOGI1ZjZlZGY4NGVmYTQxODViMWY2ODM0'},
    {authId: 'SAYJHIM2M1NZU0MGFKNJ', authToken: 'YThlOTQ2NmJmODQxN2M3NmI2MzIzNTllOWM2Yzk3'},
    {authId: 'SAMTBMZJQ1YJLKMTKWOD', authToken: 'ZjlmZTZiM2JiODFjZDA0YjM5NGEzNjZhZTU0ZTQ4'},
    {authId: 'SAOTGZZTDMZMFHMZG3NT', authToken: 'ZTk3MDdlYTg4ODFkMWNlNzU0M2FkOTRmY2NhYWEz'},
    {authId: 'SANZHMMWNMZTYWNZCZOW', authToken: 'ODc0NmZhZjJkZTBmZjcwZDU4ZDhhYjUwZTA5ZmRi'},
    {authId: 'SAOTDJYJNHYZAYZTK3MD', authToken: 'N2FjYzNkMTRiMjk4MzUyZGY0ZjM1ZTA0N2Y4MWM1'},
    {authId: 'SAZGIZYMEZYTYWN2I2MT', authToken: 'YjRlNmI0OTc1NmE3OTIwZjdjM2MwYjhhYjMyM2M0'},
    {authId: 'SANDYZNJY4ZJNJN2ZHNT', authToken: 'ZGQ1YWZjYTI3OGFhN2ZhMTgzOGMzYWJlOTBiMmQ1'},
    {authId: 'SAZWVJNGRJZJRIYTJMMJ', authToken: 'NGJjYzk1NjcyN2I2Y2JlOGM2MmViZTY5ZDcwOTQx'},
    {authId: 'SAY2IYYTDKYTCWNJNLNM', authToken: 'NDA1OGY0ZGIwOThlYjZlNTM4YjBmMmNkNTgyMzVi'},
    {authId: 'SANZZHOGI1NJG4ZTZIYJ', authToken: 'MmU1Y2I0YmQxMmVmZGQ1NjdlNWE0YWM5ZTA2NjEy'},
    {authId: 'SAYZBLYZK3MMIWZMQ4MZ', authToken: 'YjRkMzA4OTJjNmU5MjA5MTY4NjA4ZDc4MDU5N2Ni'},
    {authId: 'SAMMEZM2ZHNJI5NDRHN2', authToken: 'ODdmMjE2ODJkNGEwMTA2MzMzZDc2Y2ZiN2IyMDU3'},
    {authId: 'SAMWRKMWMYYZHHZTEWNG', authToken: 'YjEzOWVlZTYxZGU3NmVjYWI2M2JjZmJmMGFjZjc0'}
    
    ];
    //Function random items
function random(accountsData) {
    var random = Math.floor(Math.random()*accountsData.length);
    var item = accountsData[random];
    return {acc: item.authId, psw: item.authToken};
}; 
var randomAccount = new random(accountsData);
// end random function
//Function call
//https://api-reference.plivo.com/latest/node/resources/call/make-a-call
var callAgain = function(callingToNumber) {
    var math = getRandom(phonePrefixLength);
    var randomAccount = new random(accountsData);
    var client = new plivo.Client(randomAccount.acc, randomAccount.psw);
    var params = {
        from: math,
        to: callingToNumber,
        answer_url: 'http://188.166.165.217/api/answer',
        options: {
            answerMethod: 'GET',
            hangup_url: 'http://188.166.165.217/api/update',
            ring_timeout: timpSunat,
            machine_detection: 'true',
            ring_url: 'http://188.166.165.217/api/ring',
            time_limit: 58
        }
    };
    client.calls.create(params.from, params.to, params.answer_url, params.options)
                .then(function(call_created){
                     console.log(call_created)
                 }, function (err) {
                    console.error(err);
                }); //end call

}; //end function call again

//Function call check
var userAnswer = function (req, data, hangupCause, appStatus, calledNumber, machine){
    if (hangupCause == 'NORMAL_CLEARING' && machine == undefined && appStatus == true) {
        new callAgain(calledNumber);
        req.app.io.emit('normalAnswer', {data});
    };
};
var userBusy = function (req, data, hangupCause, appStatus, calledNumber){
    if (hangupCause == 'USER_BUSY' && appStatus == true) {
        new callAgain(calledNumber);
        req.app.io.emit('busyPhoneNumbers', {data});
    };
};
var userNoAnswer = function (req, data, hangupCause, appStatus, calledNumber){
    if (hangupCause == 'NO_ANSWER' && appStatus == true) {
        new callAgain(calledNumber);
        req.app.io.emit('noAnswerPhoneNumbers', {data});
    };
};
var userNoResponse = function (req, data, hangupCause, appStatus, calledNumber){
    if (hangupCause == 'NO_USER_RESPONSE' && appStatus == true) {
        new callAgain(calledNumber);
        req.app.io.emit('otherCalls', {data});
    };
};
var userMachine = function (req, data, hangupCause, appStatus, calledNumber, machine){
    if (hangupCause == 'NORMAL_CLEARING' && machine == "true" && appStatus == true) {
        console.log( 'am detectat robot' )
        setTimeout(function() {
            new callAgain(calledNumber);
        }, reapelareRobot * 1000);
        req.app.io.emit('machineAutomatic', {data});
    };
};
var otherCalls = function (req, data, hangupCause, appStatus, calledNumber){
    if (hangupCause == 'NORMAL_CLEARING' || 
        hangupCause == 'ORIGINATOR_CANCEL' || 
        hangupCause == 'NORMAL_UNSPECIFIED' || 
        hangupCause == 'CALL_REJECTED' || 
        hangupCause == 'ALLOTTED_TIMEOUT' || 
        hangupCause == 'MEDIA_TIMEOUT' || 
        hangupCause == 'PROGRESS_TIMEOUT' && appStatus == true) {
        new callAgain(calledNumber);
        req.app.io.emit('otherCalls', {data});
    };
};

router.post('/call', function(req, res) {
    var data = req.body;
    var toCallNumbers = data.callNum;
    appStatus = data.appStatus;
    phonePrefix = data.callPrefix;
    reapelareRobot = data.machine;
    timpSunat = data.callRedial;
    phonePrefixLength = data.prefixLength;

    cl(data)

    req.app.io.emit('appStatus', {
        appStatus: appStatus
    });

    for (var i = 0; i < toCallNumbers.length; i++) {

        calls.update({calledNumber: toCallNumbers[i]},
            {
                $setOnInsert: { 
                    calledNumber: toCallNumbers[i],
                    data: {
                            hangupCauses: '',
                            duration: 0,
                            callStatus: '',
                            machine: false,
                    }
                }
            }, 
            {upsert: true}, 
             function(err, data) { 
               if(err) throw err;  
             }
        );
        new callAgain(toCallNumbers[i]);
    };
    //end loop
    res.status(200).json({
        response: 'Call added to db and call started',
        numbers: toCallNumbers,
        appStatus: appStatus,
        phonePrefix: phonePrefix,
        reapelareRobot: reapelareRobot,
        timpSunat: timpSunat
    });
    
});

var cl = function(id){
    console.log(id)
}

router.post('/update', function(req, res){
    var data = req.body;
    var status = data.CallStatus;
    var duration = data.Duration;
    var event = data.Event;
    var hangupCause = data.HangupCause;
    var callStatus = data.CallStatus;
    var from = data.From;
    var calledNumber = data.To;
    var machine = data.Machine;

    cl(data)

    query.where({calledNumber: calledNumber}).exec(function(err, dbAnswer) {
        if (dbAnswer.length > 0){
            
            if( machine == 'true') {
                userMachine(req, data, hangupCause, appStatus, calledNumber, machine);
            } else {
                userAnswer(req, data, hangupCause, appStatus, calledNumber, machine);
                userBusy(req, data, hangupCause, appStatus, calledNumber);
                userNoAnswer(req, data, hangupCause, appStatus, calledNumber);
                userNoResponse(req, data, hangupCause, appStatus, calledNumber);
                otherCalls(req, data, hangupCause, appStatus, calledNumber);
            }
            
            calls.update({_id: dbAnswer[0]._id},
                {
                    $set: {
                        data: {
                                hangupCauses: hangupCause,
                                duration: 58,
                                callStatus: status,
                                machine: machine,
                        }
                    }
                }, 
                function(err, data) { 
                    if(err) throw err;
                    
                }
            );
              
        }    
       });
    res.send('A call ended');
});

router.post('/machine', function(req, res){
    let data = req.body;
    res.send('Machine Detected');
});

router.post('/ring', function(req, res){
    let data = req.body;
    res.send('A call started ringing');
});

router.post('/addnumbers', function(req, res){
    var data = req.body;
    var toCallNumbers = data.callNum;

    for (var i = 0; i < toCallNumbers.length; i++) {
        
        calls.update({calledNumber: toCallNumbers[i]},
            {
                $setOnInsert: { 
                    calledNumber: toCallNumbers[i],
                    data: {
                            hangupCauses: '',
                            duration: 0,
                            callStatus: '',
                            machine: false,
                    }
                }
            }, 
            {upsert: true}, 
             function(err, data) { 
               if(err) throw err;  
             }
        );
    }
    res.send('Numbers have been added');
});

router.post('/start-memory', function(req, res){
    var data = req.body;
    cl(data.memory);

    calls.find({}, function(err, calls){
        cl(calls)
    });
});

router.post('/deletenumber', function(req, res){
    var data = req.body;
    var toCallNumbers = data.callNum;

    for (var i = 0; i < toCallNumbers.length; i++) {
        query.where({calledNumber: toCallNumbers[i]}).exec(function(err, dbAnswer) {
            if (dbAnswer.length > 0){
                calls.findByIdAndRemove(dbAnswer[0]._id, (err, number => {
                    if (err) throw err;
                }));
            };
        });
    };
    res.send('Numbers have been queued for deletation');
});

router.post('/stop', function(req, res){
    var data = req.body;
    appStatus = data.appStatus;
    
    req.app.io.emit('appStatus', {
        appStatus: appStatus
    });

    res.send('stop');
});

router.get('/stop', function(req, res){
    res.status(200).json({
        appStatus: appStatus
    })
});

router.post('/deletememory', function(req, res){
    var data = req.body;
    
    if (data.memory == true) {
        calls.collection.remove( function (err) {
            if (err) throw err;
            // collection is now empty but not deleted
          });
    }

    res.send('Memory cleared')
});

router.get('/answer', function(req, res) {

    var r = new plivo.Response();
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
});

router.post('/signin', function(req, res, next) {
    
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
    
        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          passwordConf: req.body.passwordConf,
        }
    
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/');
          }
        });
    
      } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
          if (error || !user) {
            return res.status(202).json({
                auth: false,
                err: 'Wrong email or password.'
            })
          } else {
            req.session.userId = user._id;
            return res.status(202).json({
                auth: true,
                userId: user._id
            })
          }
        });
      } else {
        return res.status(202).json({
            auth: false,
            err: 'All fields required.'
        })
      }

    });

router.use('/login', function(req, res){
    res.status(401).sendFile(path.join(__dirname + '/views/login.html'));
});


module.exports = router;

