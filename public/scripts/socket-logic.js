var socket = io();
    socket.on('busyPhoneNumbers', function (call) {

        $("#tableBusyPhoneNumbers > tbody")
            .append(
                "<tr>"+
                    "<td>"
                        + call.data.To +
                    "</td>"+
                    "<td>"
                        + call.data.CallStatus +
                    "</td>"+
                "</tr>");
    });
    socket.on('noAnswerPhoneNumbers', function (call) {

        $("#tableNoAnswerPhoneNumbers > tbody")
            .append(
                "<tr>"+
                    "<td>"
                        + call.data.To +
                    "</td>"+
                    "<td>"
                        + call.data.CallStatus +
                    "</td>"+
                "</tr>");
    });
    socket.on('machineAutomatic', function (call) {

        $("#tableMachineAutomatic > tbody")
            .append(
                "<tr>"+
                    "<td>"
                        + call.data.To +
                    "</td>"+
                    "<td>"
                        + machine(call.data.Machine) +
                    "</td>"+
                    "<td>"
                        + call.data.Duration +
                    "</td>"
                    +"<td>"
                        + call.data.BillRate +
                    "</td>"+
                    "<td>"
                        + call.data.TotalCost +
                    "</td>"+
                "</tr>");
    });
    socket.on('machineManual', function (call) {

        $("#tableMachineManual > tbody")
            .append(
                "<tr>"+
                    "<td>"
                        + call.data.To +
                    "</td>"+
                    "<td>"
                        + machine(call.data.Machine) +
                    "</td>"+
                    "<td>"
                        + call.data.Duration +
                    "</td>"+
                    "<td>"
                        + call.data.BillRate +
                    "</td>"+
                    "<td>"
                        + call.data.TotalCost +
                    "</td>"+
                "</tr>");
    });