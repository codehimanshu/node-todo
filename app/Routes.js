"use strict"

var express = require('express')
var todoRoutes = express.Router()
var Todo = require('./Todo')


todoRoutes
.route('/all')
.get(async(req, res, next)=> {
	var todos=await Todo.find();
	res.send(todos);
		// .then(todos=>res.send(todos))
		// .catch(err=>res.status(500).send(err))
})

todoRoutes
.route('/add')
.post((req, res) => {
	let todo = new Todo();
	todo.name = req.body.name
	todo.done = false
	todo.save()
	// .catch(err=>console.log(err))
	res.send(todo)
})

module.exports = todoRoutes