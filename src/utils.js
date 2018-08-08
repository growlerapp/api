'use strict'

const { createClient } = require('@google/maps')
const config = require('./config')

const getClient = () => createClient({ key: config.google.apiKey, Promise })

/**
 * Get GeoJSON Point from address string
 * @param {String} address
 * @return {Promise<Object>}
 */
exports.geocoding = async address => {
  const googleMapsClient = getClient()
  const response = await googleMapsClient.geocode({ address }).asPromise()
  if (response.json.results.length < 1) return null
  const { lat, lng } = response.json.results[0].geometry.location
  return {
    type: 'Point',
    coordinates: [lng, lat]
  }
}

exports.matrix = async options => {
  const googleMapsClient = getClient()
  const distanceOptions = {
    origins: options.origins,
    destinations: options.destinations,
    mode: options.mode,
    language: options.language,
    units: options.units
  }
  if (distanceOptions.mode === 'driving') {
    distanceOptions.traffic_model = options.traffic_model
  } else if (distanceOptions.mode === 'transit') {
    if (options.transit_mode) {
      distanceOptions.transit_mode = options.transit_mode
    }
    if (options.transit_routing_preference) {
      distanceOptions.transit_routing_preference =
        options.transit_routing_preference
    }
  }
  if (options.avoid) distanceOptions.avoid = options.avoid
  if (options.time_type && options.time_value) {
    distanceOptions[options.time_type] = options.time_value
  }
  const response = await googleMapsClient
    .distanceMatrix(distanceOptions)
    .asPromise()
  return response
}

const round = (value, exp) => {
  if (typeof exp === 'undefined' || +exp === 0) return Math.round(value)

  value = +value
  exp = +exp

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN

  // Shift
  value = value.toString().split('e')
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] + exp : exp)))

  // Shift back
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp))
}

const prettyKm = num => {
  if (num < 1000) {
    return `${round(num, 0)} m`
  }
  return `${round(num / 1000, 1)} km`
}

exports.parseMatrixResults = (results, docs) => {
  return docs
    .map((doc, idx) => {
      const result = {
        _id: doc._id,
        name: doc.name,
        address: doc.address,
        geometry: doc.geometry
      }
      const element = results.json.rows[0].elements[idx]
      if (element.status === 'OK') {
        result.distance = element.distance
        result.duration = element.duration
      } else {
        result.distance = {
          value: parseInt(doc.distance, 10),
          text: prettyKm(parseInt(doc.distance, 10))
        }
      }
      return result
    })
    .sort((a, b) => a.distance.value - b.distance.value)
}

exports.findPlace = async (name, lat, lng, language = 'es') => {
  const googleMapsClient = getClient()
  const response = await googleMapsClient
    .place({
      input: name,
      inputtype: 'textquery',
      language: language,
      fields: 'opening_hours',
      locationbias: `point:${lat},${lng}`
    })
    .asPromise()
  return response
}
