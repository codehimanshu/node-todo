'use strict';

const validator = require('validator');
const { APP_SECRET } = require('../../config');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var R = require('ramda');

var user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid Email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
});

user.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign(
    {
      _id: user._id.toHexString(), access,
    },
    APP_SECRET
  ).toString();
  user.tokens.push({access, token});
  return user.save()
    .then(() => {
      return token;
    })
    .catch(e => console.log(e));
};

user.pre('save', function(next){
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

user.statics.findByCredentials = function(email, password) {
  var User = this;
  return this.findOne({email}).then(user => {
    if (!user)
      return Promise.reject();
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res)
          resolve(user);
        else
          reject();
      });
    });
  });
};

user.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, APP_SECRET);
  } catch (e){
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token,
  });
};

user.methods.toJSON = function() {
  var user = this;
  var userObj = user.toObject();
  return R.pick(['_id', 'name', 'email', 'phone'], userObj);
};

module.exports = mongoose.model('User', user);
