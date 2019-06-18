const TodoModel = require('../app/models/todo');
const { AuthenticationError } = require('apollo-server-express')

async function todos(parent, args, context, info) {
	var user = context.user
	if(!user)
		throw new AuthenticationError("Not Authorized")
  let todos = user.todos
  return TodoModel.find({"_id": {$in: todos}});
}

module.exports = {
  todos,
};
