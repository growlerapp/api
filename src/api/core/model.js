'use strict'

const mongoose = require('mongoose')
const { geocoding } = require('../../utils')

/**
 * @typedef {Object} GrowlerSchema
 * @property {string} name
 * @property {string} address
 * @property {string} geometry
 * @property {string} beers
 */
const growlerSchema = new mongoose.Schema({
  name: String,
  address: String,
  geometry: {
    type: { type: String },
    coordinates: [Number, Number]
  },
  beers: {
    name: String,
    price: Number,
    size: Number
  }
})

growlerSchema.index({ geometry: '2dsphere' })

growlerSchema.pre('save', async () => {
  // @ts-ignore
  if (!this.geometry && this.address) {
    try {
      // @ts-ignore
      this.geometry = await geocoding(this.address)
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
    }
  }
})

/**
 * @memberof growlerSchema
 * @this growlerSchema
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {Promise<Array<growlerSchema>>} - A list of growlers.
 * @example
 * const docs = await Growler.findByProximity(args.latitude, args.longitude)
 */
growlerSchema.statics.findByProximity = async function (lat, lng) {
  const options = {
    near: { type: 'Point', coordinates: [lng, lat] },
    distanceField: 'distance',
    spherical: true,
    maxDistance: 200000
  }
  const results = await this.aggregate()
    .near(options)
    .exec()
  return results
}

module.exports = mongoose.model('Growler', growlerSchema)
