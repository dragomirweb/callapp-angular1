'use strict';

var express = require("express");
var Todo = require("../models/todo");
//var todos = require("../../mock/todos.json");

var router = express.Router();

router.get('/todos', function(req, res, next) {
    Todo.find({}, function(err, todos) {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        res.json({
            todos: todos
        });
        next();
    });
});

router.post('/todos', function(req, res, next) {
    var todo = req.body;
    Todo.create(todo, function(err, todo) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'todo': todo,
            message: 'Todo created'
        });
        next();
    });
});

router.put('/todos/:id', function(req, res, next) {
    var id = req.params.id;
    var todo = req.body;
    if (todo && todo._id !== id) {
        return res.status(500).json({
            err: "Ids don't match"
        })
    };
    Todo.findByIdAndUpdate(id, todo, {
        new: true
    }, function(err, todo) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'todo': todo,
            message: 'Todo updated'
        });
        next();
    });
});

router.delete('/todos/:id', function(req, res, next) {
    var id = req.params.id;
    Todo.findByIdAndRemove(id, function(err, result) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            message: 'Todo Deleted'
        });
        next();
    });
});


module.exports = router;
