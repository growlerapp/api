'use strict'

const {
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const { GrowlerType } = require('../type')
const { findAll, findByProximity, findOne } = require('../resolvers')

exports.findAll = {
  type: new GraphQLList(GrowlerType),
  args: {
    name: {
      type: GraphQLString,
      description: 'Búsqueda de growlers por nombre'
    },
    address: {
      type: GraphQLString,
      description: 'Búsqueda de growlers por dirección'
    },
    limit: {
      type: GraphQLInt
    }
  },
  resolve: findAll
}

exports.findByProximity = {
  type: new GraphQLList(GrowlerType),
  args: {
    latitude: { type: new GraphQLNonNull(GraphQLFloat) },
    longitude: { type: new GraphQLNonNull(GraphQLFloat) }
  },
  resolve: findByProximity
}

exports.findOne = {
  type: GrowlerType,
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Búsqueda de growler por id'
    }
  },
  resolve: findOne
}
