'use strict'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql/type')
const { photo, place, matrix } = require('./resolvers')

const CoordinatesScalar = new GraphQLScalarType({
  name: 'GeoJSONCoordinates',
  description: 'A (multidimensional) set of coordinates following x, y order.',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: valueAST => valueAST.value
})

const GeoJSONPoint = new GraphQLObjectType({
  name: 'GeoJSONPoint',
  description: 'Object describing a single geographical point.',
  fields: {
    type: { type: GraphQLString },
    coordinates: { type: CoordinatesScalar }
  }
})

const Period = new GraphQLObjectType({
  name: 'Period',
  fields: {
    day: { type: GraphQLString },
    close: { type: GraphQLString },
    open: { type: GraphQLString },
    available: { type: GraphQLBoolean }
  }
})

const OpeningHours = new GraphQLObjectType({
  name: 'OpeningHours',
  fields: {
    openNow: { type: GraphQLBoolean },
    schedules: { type: new GraphQLList(Period) }
  }
})

const Place = new GraphQLObjectType({
  name: 'Place',
  description: 'Object describing a find place response.',
  fields: {
    phone: { type: GraphQLString },
    schedule: { type: OpeningHours },
    photo: {
      type: GraphQLString,
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: photo
    },
    rating: { type: GraphQLFloat },
    website: { type: GraphQLString }
  }
})

const Matrix = new GraphQLObjectType({
  name: 'Matrix',
  fields: {
    mode: { type: GraphQLString },
    distance: { type: GraphQLString },
    duration: { type: GraphQLString }
  }
})

exports.GrowlerType = new GraphQLObjectType({
  name: 'Growler',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    geometry: { type: GeoJSONPoint },
    distance: { type: GraphQLFloat },
    place: {
      type: Place,
      resolve: place
    },
    matrix: {
      type: new GraphQLList(Matrix),
      args: {
        latitude: { type: new GraphQLNonNull(GraphQLFloat) },
        longitude: { type: new GraphQLNonNull(GraphQLFloat) }
      },
      resolve: matrix
    }
  }
})
