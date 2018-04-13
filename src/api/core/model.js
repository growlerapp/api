'use strict'

const mongoose = require('mongoose')
const { geocoding } = require('../../utils')

const Model = new mongoose.Schema({
  name: String,
  address: String,
  geometry: {
    type: {type: String},
    coordinates: [ Number, Number ]
  }
})

Model.pre('save', async doc => {
  if (!doc.geometry && doc.address) {
    try {
      doc.geometry = await geocoding(doc.address)
    } catch (err) {
    }
  }
})

module.exports = mongoose.model('Growler', Model)
