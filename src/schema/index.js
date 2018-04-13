'use strict'

const { GraphQLSchema } = require('graphql')
const query = require('./query')

module.exports = new GraphQLSchema({ query })
