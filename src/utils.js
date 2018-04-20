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
      distanceOptions.transit_routing_preference = options.transit_routing_preference
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
