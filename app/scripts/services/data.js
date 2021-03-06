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