'use strict';

function MainCtrl ($scope, dataService) {

  // dataService.postData(function(response){
  //   console.log(resp)
  // });
  $scope.callNumbers = [];
  $scope.addNumbers = [];
  $scope.deleteNumbers = [];
  $scope.prefix = "";
  $scope.prefixLength = 8;
  $scope.redial = 0;
  $scope.machineDelay = 300;
  $scope.callRedial = 10; 
  $scope.appStatus = true;

  $scope.numToArray = function () {
    $scope.makeCall.callNum = $scope.callNumbers.split(',');
  };

  $scope.addNumbersToArray = function () {
    $scope.addNumber.callNum = $scope.addNumbers.split(',');
  };
  $scope.delNumbersToArray = function () {
    $scope.deleteNumber.callNum = $scope.deleteNumbers.split(',');
  };

  $scope.stopApp = function(){
    $scope.appStatus = false;
    var data = $scope.makeCall;
    dataService.startStop(data);
  };

  $scope.saveAll = function(){
    $scope.makeCall.callPrefix = $scope.prefix;
    $scope.makeCall.prefixLength = $scope.prefixLength;
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

  $scope.startFromMemory = function(){
    dataService.startMemory();
  };

  $scope.makeCall = {
    callNum: [],
    callPrefix: "+40",
    prefixLength: 8,
    redial: 0,
    machine: 300,
    callRedial: 10,
    appStatus: $scope.appStatus,
  };

  $scope.addNumber = {
    callNum: []
  };

  $scope.deleteNumber = {
    callNum: []
  };
  $scope.memory = false;

  $scope.delMemory = function(){
     return {
      memory: $scope.memory
     }
  };

  $scope.makeCalls = function(){
    $scope.saveAll();
    var data = $scope.makeCall;
    dataService.postData(data);
  }

  $scope.addThisNumber = function(){
    var data = $scope.addNumber;
    dataService.postNumber(data);
  }

  $scope.deleteThisNumber = function(){
    var data = $scope.deleteNumber;
    dataService.deleteNumber(data);
  }

  $scope.deleteMemory = function(){
    let data = $scope.delMemory();
    dataService.deleteMemoryNumbers(data);
  }
}

module.exports = MainCtrl;