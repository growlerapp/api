'use strict'

const querystring = require('querystring')
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

/**
 * @typedef {import('@google/maps').LatLng} LatLng
 * @typedef {import('@google/maps').TravelMode} TravelMode
 * @typedef {import('@google/maps').UnitSystem} UnitSystem
 */
/**
 * @typedef {Object} MatrixOptions
 * @param {LatLng} origin
 * @param {LatLng} destination
 * @param {TravelMode} mode
 */
/**
 * @param {MatrixOptions} options
 */
exports.matrix = async options => {
  const googleMapsClient = getClient()
  const response = await googleMapsClient
    .distanceMatrix({
      origins: [options.origin],
      destinations: [options.destination],
      mode: options.mode,
      language: 'es',
      units: 'metric',
      departure_time: 'now'
    })
    .asPromise()
  if (response.status !== 200) return null
  return response
}

exports.parseMatrixResults = results => {
  try {
    const element = results.json.rows[0].elements[0]
    return {
      mode: results.query.mode,
      distance: element.distance.text,
      duration: element.duration.text
    }
  } catch (error) {
    return null
  }
}

const getPlace = async (placeid, language = 'es') => {
  const googleMapsClient = getClient()
  try {
    const response = await googleMapsClient
      .place({
        placeid,
        language: language,
        fields: [
          'permanently_closed',
          'photo',
          'place_id',
          'url',
          'utc_offset',
          'formatted_phone_number',
          'international_phone_number',
          'opening_hours',
          'website',
          'price_level',
          'rating',
          'review'
        ]
      })
      .asPromise()
    return response.json
  } catch (err) {
    throw err
  }
}

exports.findPlace = async (name, lat, lng, language = 'es') => {
  const googleMapsClient = getClient()
  try {
    const response = await googleMapsClient
      .findPlace({
        input: name,
        inputtype: 'textquery',
        language: language,
        fields: ['place_id'],
        locationbias: `point:${lat},${lng}`
      })
      .asPromise()
    if (response.json.candidates.length === 0) return null
    const place = await getPlace(response.json.candidates[0].place_id)
    return place
  } catch (err) {
    throw err
  }
}

const parseWeekDay = weekDay => {
  const closePattern = /(\w+): (\w+)/
  const openPattern = /(\w+): (\d+:\d+).{1}(\d+:\d+)/
  if (openPattern.test(weekDay)) {
    const match = openPattern.exec(weekDay)
    return { day: match[1], open: match[2], close: match[3], available: true }
  } else {
    const match = closePattern.exec(weekDay)
    return { day: match[1], open: null, close: null, available: false }
  }
}

exports.parsePhoto = (photo, key) => {
  const params = querystring.stringify({
    maxwidth: 400,
    photoreference: photo.photo_reference,
    key: key
  })
  return `https://maps.googleapis.com/maps/api/place/photo?${params}`
}

exports.parsePlace = place => {
  return {
    phone: place.result.formatted_phone_number,
    schedule: {
      openNow: place.result.opening_hours.open_now,
      schedules: place.result.opening_hours.weekday_text.map(parseWeekDay)
    },
    photo:
      place.result.photos && place.result.photos.length > 0
        ? place.result.photos[0]
        : null,
    rating: place.result.rating,
    website: place.result.website
  }
}
