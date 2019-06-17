'use strict'

var mongoose = require('mongoose');
const validator = require('validator');
const { APP_SECRET } = require('../../config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var R = require('ramda')

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
			message: '{VALUE} is not a valid Email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
})

user.methods.generateAuthToken = function(){
	var user = this
	var access = "auth"
	var token = jwt.sign({_id:user._id.toHexString(), access}, APP_SECRET).toString();
	user.tokens.push({access, token})
	return user.save()
		.then(()=>{
			return token
		})
		.catch(e=>console.log(e))
}

user.pre('save',function(next){
	var user = this;
	if(user.isModified('password'))
	{
		bcrypt.genSalt(10,function(err,salt){
			bcrypt.hash(user.password,salt,function(err,hash){
				user.password=hash;
				next();
			});
		});
	}
	else
	{
		next();
	}
});

user.methods.toJSON = function() {
	var user = this
	var userObj = user.toObject();
	return R.pick(['_id','name','email','phone'], userObj)
}

module.exports = mongoose.model('User', user);
