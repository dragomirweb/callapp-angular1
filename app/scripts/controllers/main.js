'use strict';

function MainCtrl ($scope, dataService) {

  // dataService.postData(function(response){
  //   console.log(resp)
  // });

  $scope.callNumbers = [];
  $scope.prefix;
  $scope.redial = 0;
  $scope.machineDelay = 300;
  $scope.callRedial = 10; 
  $scope.appStatus = true;

  $scope.numToArray = function () {
    $scope.makeCall.callNum = $scope.callNumbers.split(',');
  };

  $scope.stopApp = function(){
    $scope.appStatus = false;
    var data = $scope.makeCall;
    dataService.startStop(data);
  };

  $scope.saveAll = function(){
    
      $scope.makeCall.callPrefix = $scope.prefix;
      $scope.makeCall.redial = $scope.redial;
      $scope.makeCall.machine = $scope.machineDelay;
      $scope.makeCall.callRedial = $scope.callRedial;
      $scope.makeCall.appStatus = $scope.appStatus;
    
  };
  $scope.startStop = function() {
    $scope.makeCall.appStatus = $scope.appStatus;
    var data = $scope.makeCall;
    dataService.startStop(data);
  };

  $scope.makeCall = {
    callNum: [],
    callPrefix: +40,
    redial: 0,
    machine: 300,
    callRedial: 10,
    appStatus: $scope.appStatus,
  };
  $scope.addTodo = function() {
    $scope.todos.unshift({name: "This is a new todo.",
                      completed: false});
  };
  $scope.makeCalls = function(){
    $scope.saveAll();
    var data = $scope.makeCall;
    dataService.postData(data);
  }
}

module.exports = MainCtrl;