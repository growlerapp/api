'use strict'

const Growler = require('../model')
const {
  matrix,
  parseMatrixResults,
  findPlace,
  parsePlace,
  parsePhoto
} = require('../../../utils')

/**
 * @typedef {Object} FindAllArgs
 * @property {string} name - Búsqueda de growlers por nombre.
 * @property {string} address - Búsqueda de growlers por dirección.
 * @property {number} limit
 */
/**
 * @param {*} root -
 * @param {FindAllArgs} args -
 * @returns {Promise<Array<*>>} -
 * @example
 * const docs = findAll(root, args)
 */
exports.findAll = async (root, args) => {
  const fields = { _id: 1, name: 1, address: 1, geometry: 1 }
  const query = {}
  if (args.name) {
    query.name = { $regex: `.*${args.name}.*`, $options: 'i' }
  }
  if (args.address) {
    query.address = { $regex: `.*${args.address}.*`, $options: 'i' }
  }
  let docs
  if (args.limit > 0 && args.limit < 26) {
    docs = await Growler.find(query)
      .select(fields)
      .limit(args.limit)
      .exec()
  } else {
    docs = await Growler.find(query)
      .select(fields)
      .exec()
  }
  return docs
}

/**
 * @typedef {Object} FindByProximityArgs
 * @property {number} latitude
 * @property {number} longitude
 */
/**
 * @param {*} root -
 * @param {FindByProximityArgs} args -
 * @returns {Promise<Array<*>>} -
 * @example
 * const docs = findByProximity(root, args)
 */
exports.findByProximity = (root, args) => {
  return Growler.findByProximity(args.latitude, args.longitude)
}

/**
 * @typedef {Object} FindOneArgs
 * @property {string} _id
 */
/**
 * @param {*} root -
 * @param {*} args -
 * @returns {Promise<*>} -
 * @example
 * const doc = findOne(root, args)
 */
exports.findOne = (root, args) => {
  const fields = { _id: 1, name: 1, address: 1, geometry: 1 }
  const query = { _id: args._id }
  return Growler.findOne(query)
    .select(fields)
    .exec()
}

/**
 * @typedef {Object} MatrixArgs
 * @property {number} latitude
 * @property {number} longitude
 */
/**
 * @typedef {import('./type').GrowlerType} GrowlerType
 */
/**
 * @param {GrowlerType} parent -
 * @param {MatrixArgs} args -
 * @returns {Promise<Array<*>>} -
 * @example
 * const results = matrix(parent, args)
 */
exports.matrix = async (parent, args) => {
  const results = []
  /**
   * @typedef {import('@google/maps').TravelMode} TravelMode
   * @type {Array<TravelMode>}
   **/
  const modes = ['driving', 'walking', 'transit']
  for (const mode of modes) {
    const matrixResults = await matrix({
      origin: { lat: args.latitude, lng: args.longitude },
      destination: {
        lat: parent.geometry.coordinates[1],
        lng: parent.geometry.coordinates[0]
      },
      mode: mode
    })
    const parsed = parseMatrixResults(matrixResults)
    if (parsed) results.push(parsed)
  }
  return results
}

/**
 * @typedef {import('./type').PlaceType} PlaceType
 */
/**
 * @param {GrowlerType} parent -
 * @returns {Promise<PlaceType>} -
 * @example
 * const results = place(parent)
 */
exports.place = async parent => {
  const place = await findPlace(
    parent.name,
    parent.geometry.coordinates[1],
    parent.geometry.coordinates[0]
  )
  return parsePlace(place)
}

/**
 * @param {PlaceType} parent -
 * @returns {string} -
 * @example
 * const result = photo(parent)
 */
exports.photo = parent => {
  if (!parent.photo) return null
  return parsePhoto(parent.photo)
}

/**
 * @typedef {import('../../../schema/core').Args<import('./type').UploadBarInput>} UploadBarInputArgs
 */
/**
 * @param {*} root -
 * @param {UploadBarInputArgs} args -
 * @returns {Promise<*>} -
 * @example
 * const growler = uploadBar(root, args)
 */
exports.uploadBar = (root, args) => {
  return Growler.create({
    name: args.input.name,
    address: args.input.address,
    geometry: {
      coordinates: [args.input.longitude, args.input.latitude],
      type: 'Point'
    },
    beers: args.input.beers
  })
}
