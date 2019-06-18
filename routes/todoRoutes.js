'use strict';

var express = require('express');
var todoRoutes = express.Router();
var Todo = require('../app/models/todo');
var authenticate = require('../app/middleware/auth');

todoRoutes
  .route('/all')
  .get(authenticate, async(req, res, next) => {
    var todos = await Todo.find();
    res.send(todos);
  });

todoRoutes
  .route('/add')
  .post(authenticate, (req, res) => {
    let todo = new Todo();
    todo.name = req.body.name;
    todo.done = false;
    todo.save();
    res.send(todo);
  });

todoRoutes
  .route('/update/:id')
  .post(authenticate, async(req, res) => {
    let todo = await Todo.findById(req.params.id);
    todo.done = true;
    todo.save();
    res.send(todo);
  });

todoRoutes
  .route('/delete/:id')
  .post(authenticate, async(req, res) => {
    let todo = await Todo.deleteOne({_id: req.params.id});
    res.send(todo);
  });
module.exports = todoRoutes;
