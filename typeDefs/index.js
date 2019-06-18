const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		todos: [Todo]
	}

	type Todo {
		_id: ID,
		name: String,
		done: Boolean,
	}

	type Token {
		access: String,
		token: String,
	}

	type User {
		_id: ID,
		name: String,
		email: String,
		phone: String,
		tokens: [Token],
	}

	type Mutation {
		addTodo (
			name: String!
			done: Boolean!
		): Todo

		updateTodo (
			_id: ID!
		): Todo

		deleteTodo (
			_id: ID!
		): Todo

		login (
			email: String!
			password: String!
		): String

		signUp (
			name: String!
			email: String!
			password: String!
			phone: String!
		): User
	}
`