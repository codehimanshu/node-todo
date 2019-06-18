const { gql } = require('apollo-server-express');
const UserModel = require('./app/models/user');
const Query = require('./resolvers/Query');

typeDefs = gql`
	type Todo {
		name: String
		done: Boolean
	}

	type Query {
		todos: [Todo]
	}
`;
const resolvers = {
  Query,
};


module.exports = {
  typeDefs,
  resolvers,
};
