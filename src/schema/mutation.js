'use strict'

const { GraphQLObjectType } = require('graphql')
const fields = require('../api/core/schema/fields/mutation')

module.exports = new GraphQLObjectType({
  name: 'mutation',
  fields: () => ({ ...fields })
})
