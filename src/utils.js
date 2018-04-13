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
    coordinates: [ lng, lat ]
  }
}

exports.matrix = async () => {
  const googleMapsClient = createClient({ key: config.google.apiKey, Promise })
  // const origins = [{ lat: origin.lat, lng: origin.lng }]
  const origins = [{ lat: -33.4666204, lng: -70.6269754 }]
  const destinations = [{ lng: -70.6345789, lat: -33.43379 },
    { lng: -70.6243473, lat: -33.4484967 }]
  const response = await googleMapsClient.distanceMatrix({
    origins,
    destinations,
    departure_time: 'now',
    mode: 'driving',
    traffic_model: 'best_guess',
    language: 'es'
  }).asPromise()
  return response
}
