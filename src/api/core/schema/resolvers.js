'use strict'

const Growler = require('../model')
const {
  matrix,
  parseMatrixResults,
  findPlace,
  parsePlace,
  parsePhoto
} = require('../../../utils')

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

exports.findByProximity = async (root, args) => {
  const docs = await Growler.findByProximity(args.latitude, args.longitude)
  return docs
}

exports.findOne = async (root, args) => {
  const fields = { _id: 1, name: 1, address: 1, geometry: 1 }
  const query = { _id: args._id }
  const doc = await Growler.findOne(query)
    .select(fields)
    .exec()
  return doc
}

exports.matrix = async (parent, args, context, info) => {
  const results = []
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

exports.place = async (parent, args, context, info) => {
  const place = await findPlace(
    parent.name,
    parent.geometry.coordinates[1],
    parent.geometry.coordinates[0]
  )
  return parsePlace(place)
}

exports.photo = (parent, args, context, info) => {
  if (!parent.photo) return null
  const photo = parsePhoto(parent.photo)
  return photo
}

exports.uploadBar = async (root, args, context, info) => {
  const growler = await Growler.create({
    name: args.input.name,
    address: args.input.address,
    geometry: {
      coordinates: [args.input.longitude, args.input.latitude],
      type: 'Point'
    },
    beers: args.input.beers
  })
  return growler
}
