'use strict';

const User = require('../models/user');
const { APP_SECRET } = require('../../config');
const jwt = require('jsonwebtoken');

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

var graphAuthenticate = async (token) => {
  var user = await User.findByToken(token)
  return user
};

module.exports = {
  apiAuthenticate,
  graphAuthenticate,
};
