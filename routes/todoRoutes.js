'use strict';

var express = require('express');
var todoRoutes = express.Router();
var Todo = require('../app/models/todo');
var { apiAuthenticate } = require('../app/middleware/auth');
var R = require('ramda');

todoRoutes
  .route('/all')
  .get(apiAuthenticate, async(req, res, next) => {
  	let user = req.user;
  	let userTodos = user.todos;
    var todos = await Todo.find({_id: {$in: userTodos}});
    res.send(todos);
  });

todoRoutes
  .route('/add')
  .post(apiAuthenticate, (req, res) => {
  	let user = req.user;

  	// Create Todo
    let todo = new Todo();
    todo.name = req.body.name;
    todo.done = false;
    todo.save();

    // Add todo to logged in users todos
  	user.todos.push(todo._id);
  	user.save();
    res.send(todo);
  });

todoRoutes
  .route('/update/:id')
  .post(apiAuthenticate, async(req, res) => {
  	// Check if the Todo is for logged in user
  	let user = req.user;
  	let userTodos = user.todos;
  	let loc = R.indexOf(req.params.id, userTodos);
  	if (loc == -1)
  		res.status(401).send('Unauthorized');

  	// Update Todo
    let todo = await Todo.findById(req.params.id);
    todo.done = true;
    todo.save();
    res.send(todo);
  });

todoRoutes
  .route('/delete/:id')
  .post(apiAuthenticate, async(req, res) => {
  	// Check if the Todo is for logged in user
  	let user = req.user;
  	let userTodos = user.todos;
  	let loc = R.indexOf(req.params.id, userTodos);
  	if (loc == -1)
  		res.status(401).send('Unauthorized');

  	// Delete Todo
    let todo = await Todo.deleteOne({_id: req.params.id});
    res.send(todo);
  });
module.exports = todoRoutes;
