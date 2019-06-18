const TodoModel = require('../app/models/todo');
const { graphAuthenticate } = require('../app/middleware/auth');

async function todos(parent, args, context, info) {
	graphAuthenticate(context);
  return TodoModel.find();
}

module.exports = {
  todos,
};
