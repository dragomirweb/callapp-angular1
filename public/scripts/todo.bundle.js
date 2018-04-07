webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	angular.module('todoListApp', []);

	__webpack_require__(3);
	__webpack_require__(5);
	__webpack_require__(7);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	angular.module('todoListApp').service('dataService', __webpack_require__(4));

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';


	function DataService ($http, $q) {

	  this.postData = function(data) {
	     $http.post('/api/call', data);
	  };

	  this.postNumber = function(data) {
	    $http.post('/api/addnumbers', data);
	 };

	 this.deleteNumber = function(data) {
	  $http.post('/api/deletenumber', data);
	};

	  this.deleteMemoryNumbers = function(data){
	    $http.post('/api/deletememory', data);
	  };

	  this.startStop = function(data){
	    $http.post('/api/stop',data);
	  };

	  this.startMemory = function(){
	    $http.post('/api/start-memory', {
	      memory: true
	    });
	  };

	  this.getTodos = function(cb) {
	    $http.get('/api/todos').then(cb);
	  };

	  this.deleteTodo = function(todo) {
	    if (!todo._id) {
	      return $q.resolve();
	    }
	    return $http.delete('/api/todos/' + todo._id).then(function() {
	      console.log("I deleted the " + todo.name + " todo!");
	    });
	  };

	  this.saveTodos = function(todos) {
	    var queue = [];
	    todos.forEach(function(todo) {
	      var request;
	      if(!todo._id) {
	        request = $http.post('/api/todos', todo);
	      } else {
	        request = $http.put('/api/todos/' + todo._id, todo).then(function(result) {
	          todo = result.data.todo;
	          return todo;
	        });
	      }
	      queue.push(request);
	    });
	    return $q.all(queue).then(function(results) {
	      console.log("I saved " + todos.length + " todos!");
	    });
	  };

	}

	module.exports = DataService;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	angular.module('todoListApp').directive('todo', __webpack_require__(6));

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	function ToDoDirective () {
	  return {
	    templateUrl: 'templates/todo.html',
	    replace: true,
	    controller: 'todoCtrl'
	  }
	}

	module.exports = ToDoDirective;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var angular = __webpack_require__(1);

	angular.module('todoListApp').controller('mainCtrl', __webpack_require__(8));
	angular.module('todoListApp').controller('todoCtrl', __webpack_require__(9));

/***/ },
/* 8 */
/***/ function(module, exports) {

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

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	function TodoCtrl ($scope, dataService) {

	  $scope.deleteTodo = function(todo, index) {
	    dataService.deleteTodo(todo).then(function() {
	      $scope.todos.splice(index, 1);
	    });
	  };

	  $scope.saveTodos = function() {
	    var filteredTodos = $scope.todos.filter(function(todo){
	      if(todo.edited) {
	        return todo
	      };
	    })
	    dataService.saveTodos(filteredTodos)
	      .finally($scope.resetTodoState());
	  };

	  $scope.resetTodoState = function() {
	      $scope.todos.forEach(function(todo) {
	         todo.edited = false;
	      });
	  }
	}

	module.exports = TodoCtrl;

/***/ }
]);