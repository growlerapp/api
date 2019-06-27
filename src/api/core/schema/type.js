'use strict'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLEnumType
} = require('graphql/type')
const { photo, place, matrix } = require('./resolvers')

const CoordinatesScalar = new GraphQLScalarType({
  name: 'GeoJSONCoordinates',
  description: 'A (multidimensional) set of coordinates following x, y order.',
  serialize: value => value,
  parseValue: value => value,
  // @ts-ignore
  parseLiteral: valueAST => valueAST.value
})

/**
 * @typedef {Object} GeoJSONPointType
 * @property {string} [type]
 * @property {[number, number]} [coordinates]
 */
const GeoJSONPoint = new GraphQLObjectType({
  name: 'GeoJSONPoint',
  description: 'Object describing a single geographical point.',
  fields: {
    type: { type: GraphQLString },
    coordinates: { type: CoordinatesScalar }
  }
})

/**
 * @typedef {Object} PeriodType
 * @property {string} [day]
 * @property {string} [close]
 * @property {string} [open]
 * @property {boolean} [available]
 */
const Period = new GraphQLObjectType({
  name: 'Period',
  fields: {
    day: { type: GraphQLString },
    close: { type: GraphQLString },
    open: { type: GraphQLString },
    available: { type: GraphQLBoolean }
  }
})

/**
 * @typedef {Object} OpeningHoursType
 * @property {boolean} [openNow]
 * @property {Array<PeriodType>} [schedules]
 */
const OpeningHours = new GraphQLObjectType({
  name: 'OpeningHours',
  fields: {
    openNow: { type: GraphQLBoolean },
    schedules: { type: new GraphQLList(Period) }
  }
})

/**
 * @typedef {import('@google/maps').PlacePhoto} PlacePhoto
 */
/**
 * @typedef {Object} PlaceType
 * @property {string} [phone]
 * @property {OpeningHoursType} [schedule]
 * @property {PlacePhoto} [photo]
 * @property {number} [rating]
 * @property {string} [website]
 */
const Place = new GraphQLObjectType({
  name: 'Place',
  description: 'Object describing a find place response.',
  fields: {
    phone: { type: GraphQLString },
    schedule: { type: OpeningHours },
    photo: {
      type: GraphQLString,
      args: {
        key: { type: GraphQLString }
      },
      resolve: photo
    },
    rating: { type: GraphQLFloat },
    website: { type: GraphQLString }
  }
})

/**
 * @typedef {Object} MatrixType
 * @property {string} [mode]
 * @property {string} [distance]
 * @property {string} [duration]
 */
const Matrix = new GraphQLObjectType({
  name: 'Matrix',
  fields: {
    mode: { type: GraphQLString },
    distance: { type: GraphQLString },
    duration: { type: GraphQLString }
  }
})

/**
 * @typedef {Object} GrowlerType
 * @property {string} [_id]
 * @property {string} [name]
 * @property {string} [address]
 * @property {GeoJSONPointType} [geometry]
 * @property {number} [distance]
 * @property {PlaceType} [place]
 * @property {Array<MatrixType>} [matrix]
 */
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

/**
 * Enum con filtros de periodos para listar los cursos.
 *
 * @typedef {Object} BeerSizeType
 * @property {number} SMALL - 32 onzas (1 litro).
 * @property {number} BIG - 64 onzas (1,9 litro).
 * @example
 * const InputType = require('./Type/inputTypeData')
 */
const BeerSize = new GraphQLEnumType({
  name: 'BeerSize',
  values: {
    SMALL: { value: 32, description: '32 onzas (1 litro)' },
    BIG: { value: 64, description: '64 onzas (1,9 litro)' }
  }
})

/**
 * @typedef {Object} BeerInputType
 * @property {string} name
 * @property {number} price
 * @property {BeerSizeType} size
 */
const BeerInputType = new GraphQLInputObjectType({
  name: 'BeerInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    size: { type: new GraphQLNonNull(BeerSize) }
  }
})

/**
 * @typedef {Object} UploadBarInput
 * @property {string} name
 * @property {string} address
 * @property {number} latitude
 * @property {number} longitude
 * @property {Array<BeerInputType>} beers
 */
exports.UploadBarInput = new GraphQLInputObjectType({
  name: 'UploadBarInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    latitude: { type: new GraphQLNonNull(GraphQLFloat) },
    longitude: { type: new GraphQLNonNull(GraphQLFloat) },
    beers: { type: new GraphQLNonNull(GraphQLList(BeerInputType)) }
  }
})
