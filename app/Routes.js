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
	res.send(todo)
})

todoRoutes
.route('/update/:id')
.post(async (req, res) => {
	let todo = await Todo.findById(req.params.id)
	todo.done = true
	todo.save()
	res.send(todo)
})

todoRoutes
.route('/delete/:id')
.post(async (req, res) => {
	let todo = await Todo.deleteOne({_id:req.params.id})
	res.send(todo)
})
module.exports = todoRoutes