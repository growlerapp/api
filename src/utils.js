'use strict'

const axios = require('axios').default
const querystring = require('querystring')
const {
  Client,
  PlaceInputType,
  Language,
  UnitSystem
} = require('@googlemaps/google-maps-services-js')
const config = require('./config')

/**
 * @typedef {import('@googlemaps/google-maps-services-js').Client} Client
 * @typedef {import('@googlemaps/google-maps-services-js').GeocodeRequest} GeocodeRequest
 * @typedef {import('@googlemaps/google-maps-services-js').PlaceDetailsResponse} PlaceDetailsResponse
 * @typedef {import('@googlemaps/google-maps-services-js').LatLng} LatLng
 * @typedef {import('@googlemaps/google-maps-services-js').TravelMode} TravelMode
 * @typedef {import('@googlemaps/google-maps-services-js').UnitSystem} UnitSystem
 * @typedef {import('@googlemaps/google-maps-services-js').DistanceMatrixResponse} DistanceMatrixResponse
 * @typedef {import('@googlemaps/google-maps-services-js').Language} Language
 * @typedef {import('./api/core/schema/type').MatrixType} MatrixType
 * @typedef {import('./api/core/schema/type').PeriodType} PeriodType
 * @typedef {import('@googlemaps/google-maps-services-js').PlacePhoto} PlacePhoto
 * @typedef {import('./api/core/schema/type').PlaceType} PlaceType
 */
/**
 * @typedef {Object} GeoJSONPoint
 * @property {string} type
 * @property {Array<number>} coordinates
 */
/**
 * @typedef {Object} MatrixOptions
 * @property {LatLng} origin
 * @property {LatLng} destination
 * @property {TravelMode} mode
 */

/**
 * @returns {Client} - A GoogleMapsClient.
 * @example
 * const googleMapsClient = getClient()
 */
const getClient = () => {
  const axiosInstance = axios.create()
  return new Client({ axiosInstance })
}

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
  const response = await googleMapsClient.geocode({
    params: { address, key: config.google.apiKey }
  })
  if (response.data.results.length < 1) return null
  const { lat, lng } = response.data.results[0].geometry.location
  return {
    type: 'Point',
    coordinates: [lng, lat]
  }
}

/**
 * @param {MatrixOptions} options - Options to set origin, destination and mode.
 * @returns {Promise<DistanceMatrixResponse>} - A DistanceMatrixResponse.
 * @example
 * const matrixResults = await matrix({ origin, destination, mode })
 */
exports.matrix = async options => {
  const googleMapsClient = getClient()
  const response = await googleMapsClient.distancematrix({
    params: {
      origins: [options.origin],
      destinations: [options.destination],
      mode: options.mode,
      language: Language.es,
      units: UnitSystem.metric,
      departure_time: new Date(),
      key: config.google.apiKey
    }
  })
  if (response.status !== 200) return null
  return response
}

/**
 * @param {DistanceMatrixResponse} results - A DistanceMatrixResponse.
 * @returns {MatrixType} - A DistanceMatrixResponse parsed.
 * @example
 * const parsed = parseMatrixResults(matrixResults)
 */
exports.parseMatrixResults = results => {
  try {
    const element = results.data.rows[0].elements[0]
    return {
      distance: element.distance.text,
      duration: element.duration.text
    }
  } catch (error) {
    return null
  }
}

/**
 * @param {string} placeid - A Place ID.
 * @param {Language} [language='es'] - A Language code.
 * @returns {Promise<PlaceDetailsResponse>} - A PlaceDetailsResponse.
 * @example
 * const place = await getPlace(placeId)
 */
const getPlace = async (placeid, language = Language.es) => {
  const googleMapsClient = getClient()
  return await googleMapsClient.placeDetails({
    params: {
      place_id: placeid,
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
      ],
      key: config.google.apiKey
    }
  })
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
exports.findPlace = async (name, lat, lng, language = Language.es) => {
  const googleMapsClient = getClient()
  const response = await googleMapsClient.findPlaceFromText({
    params: {
      input: name,
      inputtype: PlaceInputType.textQuery,
      language: language,
      fields: ['place_id'],
      locationbias: `point:${lat},${lng}`,
      key: config.google.apiKey
    }
  })
  if (response.data.candidates.length === 0) return null
  return getPlace(response.data.candidates[0].place_id)
}

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
 * @param {PlaceDetailsResponse} place - A Place photo.
 * @returns {PlaceType} - A Place.
 * @example
 * const parsed = parsePlace(place)
 */
exports.parsePlace = place => {
  let schedule = null
  if (place.data.result.opening_hours) {
    schedule = {
      openNow: place.data.result.opening_hours.open_now,
      schedules: place.data.result.opening_hours.weekday_text.map(parseWeekDay)
    }
  }
  return {
    phone: place.data.result.formatted_phone_number,
    schedule,
    photo:
      place.data.result.photos && place.data.result.photos.length > 0
        ? place.data.result.photos[0]
        : null,
    rating: place.data.result.rating,
    website: place.data.result.website
  }
}
