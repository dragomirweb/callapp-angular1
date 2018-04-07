var socket = io();
socket.on('normalAnswer', function (res) {

    $("#tableAnswered > tbody").append("<tr>");
    $.each(res.data, function (index, value) {
        $("#tableAnswered > tbody").append(
            "<td>" + value + "</td>"
        );
    });
    $("#tableAnswered > tbody").append("</tr>");
});
socket.on('busyPhoneNumbers', function (res) {

    $("#tableBusyPhoneNumbers > tbody").append("<tr>");
    $.each(res.data, function (index, value) {
        $("#tableBusyPhoneNumbers > tbody").append(
            "<td>" + value + "</td>"
        );
    });
    $("#tableBusyPhoneNumbers > tbody").append("</tr>");
});
socket.on('noAnswerPhoneNumbers', function (res) {
    $("#tableNoAnswerPhoneNumbers > tbody").append("<tr>");
    $.each(res.data, function (index, value) {
        $("#tableNoAnswerPhoneNumbers > tbody").append(
            "<td>" + value + "</td>"
        );
    });
    $("#tableNoAnswerPhoneNumbers > tbody").append("</tr>");

});
socket.on('machineAutomatic', function (res) {
    $("#tableMachineAutomatic > tbody").append("<tr>");
    $.each(res.data, function (index, value) {
        $("#tableMachineAutomatic > tbody").append(
            "<td>" + value + "</td>"
        );
    });
    $("#tableMachineAutomatic > tbody").append("</tr>");

});
socket.on('otherCalls', function (res) {
    $("#tableOtherCalls > tbody").append("<tr>");
    $.each(res.data, function (index, value) {
        $("#tableOtherCalls > tbody").append(
            "<td>" + value + "</td>"
        );
    });
    $("#tableOtherCalls > tbody").append("</tr>");

});

socket.on('appStatus', function(res) {
    if(res.appStatus == true){
        $('#stare-aplicatie').css('background', 'green');
    } else if (res.appStatus == false) {
        $('#stare-aplicatie').css('background', 'red');
    }

});

$.get('/api/stop', function(res){
    if(res.appStatus == true){
        $('#stare-aplicatie').css('background', 'green');
    } else if (res.appStatus == false) {
        $('#stare-aplicatie').css('background', 'red');
    }
});