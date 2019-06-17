"use strict"

var express = require('express')
var morgan = require('morgan')
var path = require('path')
var app = express()	
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var R = require('ramda')

var config = require('./config')

mongoose.connect(config.DB, { useNewUrlParser: true })

app.use(express.static(path.join(__dirname, '/public')))

// app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = config.APP_PORT || 4000
app.listen(port)

console.log('App listening on port ' + port)

var todoRoutes = require('./routes/todoRoutes')
var authRoutes = require('./routes/authRoutes')
app.use('/todo', todoRoutes)
app.use('/auth', authRoutes)

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})

app.get('/', (req, res, next) => {
	res.sendfile('./public/index.html')
})