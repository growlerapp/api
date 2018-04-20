'use strict'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType
} = require('graphql')

const CoordinatesScalar = new GraphQLScalarType({
  name: 'GeoJSONCoordinates',
  description: 'A (multidimensional) set of coordinates following x, y order.',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: valueAST => valueAST.value
})

const Type = new GraphQLObjectType({
  name: 'Growler',
  fields: {
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    geometry: {
      type: new GraphQLObjectType({
        name: 'GeoJSONPoint',
        description: 'Object describing a single geographical point.',
        fields: {
          type: { type: GraphQLString },
          coordinates: { type: CoordinatesScalar }
        }
      })
    }
  }
})

module.exports = Type
