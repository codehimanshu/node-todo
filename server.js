"use strict"

var express = require('express')
var morgan = require('morgan')
var path = require('path')
var app = express()	
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

var config = require('./app/Config')

mongoose.connect(config.DB)

app.use(express.static(path.join(__dirname, '/public')))

// app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = config.APP_PORT || 4000
app.listen(port)

console.log('App listening on port ' + port)

var todoRoutes = require('./app/Routes')
app.use('/api', todoRoutes)

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})

app.get('/', (req, res, next) => {
	res.sendfile('./public/index.html')
})