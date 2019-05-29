'use strict'

const querystring = require('querystring')
const { createClient } = require('@google/maps')
const config = require('./config')

/** @typedef {import('@google/maps').GoogleMapsClient} GoogleMapsClient */
/**
 * @returns {GoogleMapsClient} - A GoogleMapsClient.
 * @example
 * const googleMapsClient = getClient()
 */
const getClient = () => createClient({ key: config.google.apiKey, Promise })

/**
 * @typedef {Object} GeoJSONPoint
 * @property {string} type
 * @property {Array<number>} coordinates
 */
/**
 * Get GeoJSON Point from address string.
 *
 * @param {string} address - Address.
 * @returns {Promise<GeoJSONPoint>} - A GeoJSONPoint.
 * @example
 * const geometry = await geocoding(address)
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
 * @typedef {import('@google/maps').DistanceMatrixResponse} DistanceMatrixResponse
 * @typedef {import('@google/maps').Language} Language
 * @typedef {import('@google/maps').ClientResponse<DistanceMatrixResponse>} ClientResponseDistanceMatrixResponse
 */
/**
 * @typedef {Object} MatrixOptions
 * @property {LatLng} origin
 * @property {LatLng} destination
 * @property {TravelMode} mode
 */
/**
 * @param {MatrixOptions} options - Options to set origin, destination and mode.
 * @returns {Promise<ClientResponseDistanceMatrixResponse>} - A DistanceMatrixResponse.
 * @example
 * const matrixResults = await matrix({ origin, destination, mode })
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
      // @ts-ignore
      departure_time: 'now'
    })
    .asPromise()
  if (response.status !== 200) return null
  return response
}

/**
 * @typedef {import('./api/core/schema/type').MatrixType} MatrixType
 */
/**
 * @param {ClientResponseDistanceMatrixResponse} results - A DistanceMatrixResponse.
 * @returns {MatrixType} - A DistanceMatrixResponse parsed.
 * @example
 * const parsed = parseMatrixResults(matrixResults)
 */
exports.parseMatrixResults = results => {
  try {
    const element = results.json.rows[0].elements[0]
    return {
      // @ts-ignore
      mode: results.query.mode,
      distance: element.distance.text,
      duration: element.duration.text
    }
  } catch (error) {
    return null
  }
}

/**
 * @typedef {import('@google/maps').PlaceDetailsResponse} PlaceDetailsResponse
 */
/**
 * @param {string} placeid - A Place ID.
 * @param {Language} [language='es'] - A Language code.
 * @returns {Promise<PlaceDetailsResponse>} - A PlaceDetailsResponse.
 * @example
 * const place = await getPlace(placeId)
 */
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

/**
 * @param {string} name - A Place name.
 * @param {number} lat - A Place latitude.
 * @param {number} lng - A Place longitude.
 * @param {Language} [language='es'] - A Language code.
 * @returns {Promise<PlaceDetailsResponse>} - A PlaceDetailsResponse.
 * @example
 * const place = await findPlace(name, lat, lng)
 */
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

/**
 * @typedef {import('./api/core/schema/type').PeriodType} PeriodType
 */
/**
 * @param {string} weekDay - A Place name.
 * @returns {PeriodType} - A Period.
 * @example
 * const parsed = parseWeekDay(weekday_text)
 */
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

/**
 * @typedef {import('@google/maps').PlacePhoto} PlacePhoto
 */
/**
 * @param {PlacePhoto} photo - A Place photo.
 * @returns {string} - A image url.
 * @example
 * const photoUrl = parsePhoto(photo)
 */
exports.parsePhoto = photo => {
  const params = querystring.stringify({
    maxwidth: 400,
    photoreference: photo.photo_reference,
    key: config.google.apiKey
  })
  return `https://maps.googleapis.com/maps/api/place/photo?${params}`
}

/**
 * @typedef {import('./api/core/schema/type').PlaceType} PlaceType
 */
/**
 * @param {PlaceDetailsResponse} place - A Place photo.
 * @returns {PlaceType} - A Place.
 * @example
 * const parsed = parsePlace(place)
 */
exports.parsePlace = place => {
  let schedule = null
  if (place.result.opening_hours) {
    schedule = {
      openNow: place.result.opening_hours.open_now,
      // @ts-ignore
      schedules: place.result.opening_hours.weekday_text.map(parseWeekDay)
    }
  }
  return {
    phone: place.result.formatted_phone_number,
    schedule,
    photo:
      place.result.photos && place.result.photos.length > 0
        ? place.result.photos[0]
        : null,
    rating: place.result.rating,
    website: place.result.website
  }
}
