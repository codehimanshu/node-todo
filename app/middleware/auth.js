'use strict';

const User = require('../models/user');
const { APP_SECRET } = require('../../config');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express')

var apiAuthenticate = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then(user => {
    if (!user)
      return Promise.reject();
    req.user = user;
    req.token = token;
    next();
  })
    .catch(e => {
      res.status(401).send('Unauthorized');
    });
};

var graphAuthenticate = (context) => {
  const token = context.headers['x-auth']
  if(token) {
    try {
      const {userId} = jwt.verify(token, APP_SECRET)
      return userId
    }catch(e){
        throw new AuthenticationError('must authenticate')
    }
  }
  throw new Error('Not Authenticated')
};

module.exports = {
  apiAuthenticate,
  graphAuthenticate,
};
