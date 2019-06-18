const TodoModel = require('../app/models/todo');
const UserModel = require('../app/models/user');
const { AuthenticationError } = require('apollo-server-express')
const R = require('ramda');

function addTodo(parent, args, context, info) {
	var user = context.user
	if(!user)
		throw new AuthenticationError("Not Authorized")
	// Create Todo
	let todo = new TodoModel();
	todo.name = args.name;
	todo.done = false;
	todo.save();

    // Add todo to logged in users todos
    user.todos.push(todo._id);
    user.save();
    
    return todo  
  }

  async function updateTodo(parent, args, context, info) {
  	// Check if the Todo is for logged in user
  	var user = context.user
  	if(!user)
  		throw new AuthenticationError("Not Authorized")

    let userTodos = user.todos;
    let loc = R.indexOf(args._id, userTodos);
    if (loc == -1)
      throw new AuthenticationError("Not Authorized")

  	// Update Todo
  	let todo = await TodoModel.findById(args._id);
    todo.done = true;
    todo.save();

    return todo
  }

  async function deleteTodo(parent, args, context, info) {
   // Check if the Todo is for logged in user
   var user = context.user
   if(!user)
     throw new AuthenticationError("Not Authorized")

   let userTodos = user.todos;
   let loc = R.indexOf(args._id, userTodos);
   if (loc == -1)
     throw new AuthenticationError("Not Authorized")

   user.todos = R.remove(loc, 1,userTodos)
   console.log(user.todos)
   user.save()

    // Delete Todo
    let todo = await TodoModel.findOneAndRemove({_id: args._id});
    return todo
  }

  async function login(parent, args, context, info) {

    token = await UserModel.findByCredentials(args.email, args.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        return token
      })
      .catch(e => {
        throw new AuthenticationError(e)
      });
    })
    .catch(e => {
      throw new AuthenticationError(e)
    });
    return token
  }

  async function signUp(parent, args, context, info) {
// var body = R.pick(['email', 'name', 'password', 'phone'], args);
    var user = new UserModel(args);
    var token = await user.save()
      .then(() => {
        return user.generateAuthToken();
      })
      .then(token => {
        return token
      })
      .catch(e => {
      throw new AuthenticationError(e)
      });
      return user
  }
  module.exports = {
  	addTodo,
  	updateTodo,
    deleteTodo,
    login,
    signUp
  }