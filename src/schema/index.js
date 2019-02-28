'use strict'

const { GraphQLSchema } = require('graphql')
const query = require('./query')
const mutation = require('./mutation')

module.exports = new GraphQLSchema({ query, mutation })
