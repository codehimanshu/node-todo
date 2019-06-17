"use strict"

var express = require('express')
var authRoutes = express.Router()
var R = require('ramda')
var User = require('../app/models/user')

authRoutes
.route('/signup')
.post(async (req, res, next) => {
	var body = R.pick(['email','name','password','phone'],req.body)
	var user = new User(body)
	user.save()
		.then(()=>{
			return user.generateAuthToken()
		})
		.then(token=>{
			console.log(token)
			res.header('x-auth', token).send(user)
		})
		.catch(e=>{
			res.status(400).send(e)
		})
})

module.exports = authRoutes