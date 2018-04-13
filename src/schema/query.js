'use strict'

const { GraphQLObjectType } = require('graphql')
const fields = require('../api/core/schema/fields/query')

module.exports = new GraphQLObjectType({
  name: 'query',
  fields: () => ({ ...fields })
})
