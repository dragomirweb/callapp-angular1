'use strict';

var express = require("express");
var router = express.Router();
var todos = require("../../mock/todos.json");

router.get('/todos', function(req, res, next) {
    res.json({
        todos: todos
    });
    next();
});


module.exports = router;
