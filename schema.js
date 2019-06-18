const { gql } = require('apollo-server-express');
const UserModel = require('./app/models/user');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const typeDefs = require('./typeDefs')

const resolvers = {
  Query,
  Mutation,
};

module.exports = {
  typeDefs,
  resolvers,
};
