'use strict'

const Growler = require('../model')

exports.findAll = async (root, args) => {
  const fields = { _id: -1, name: 1, address: 1, geometry: 1 }
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
