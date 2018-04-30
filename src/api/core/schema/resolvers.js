'use strict'

const Growler = require('../model')
const { matrix, parseMatrixResults } = require('./../../../utils')

exports.findAll = async (root, args) => {
  const fields = { _id: 1, name: 1, address: 1, geometry: 1 }
  const query = {}
  if (args.name) {
    query.name = { $regex: `.*${args.name}.*`, $options: 'i' }
  }
  if (args.address) {
    query.address = { $regex: `.*${args.address}.*`, $options: 'i' }
  }
  const docs = await Growler.find(query)
    .select(fields)
    .exec()
  return docs
}

exports.findByProximity = async (root, args) => {
  const origins = [{ lat: args.latitude, lng: args.longitude }]
  const docs = await Growler.findByProximity(
    args.latitude,
    args.longitude,
    args.max_distance
  )
  if (docs.length === 0) return docs
  const destinations = docs.map(doc => {
    return {
      lat: doc.geometry.coordinates[1],
      lng: doc.geometry.coordinates[0]
    }
  })
  const options = {
    origins,
    destinations,
    mode: args.mode,
    language: args.language,
    avoid: args.avoid,
    units: args.units,
    time_type: args.time_type,
    time_value: args.time_value,
    traffic_model: args.traffic_model,
    transit_mode: args.transit_mode,
    transit_routing_preference: args.transit_routing_preference
  }
  const matrixResults = await matrix(options)
  const results = parseMatrixResults(matrixResults, docs)
  return results
}

exports.findOne = async (root, args) => {
  const fields = { _id: 1, name: 1, address: 1, geometry: 1 }
  const query = { _id: args._id }
  const doc = await Growler.findOne(query)
    .select(fields)
    .exec()
  return doc
}
