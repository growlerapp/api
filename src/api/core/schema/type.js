'use strict'

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType
} = require('graphql')

const CoordinatesScalar = new GraphQLScalarType({
  name: 'GeoJSONCoordinates',
  description: 'A (multidimensional) set of coordinates following x, y order.',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: valueAST => valueAST.value
})

exports.GrowlerType = new GraphQLObjectType({
  name: 'Growler',
  fields: {
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    geometry: {
      type: new GraphQLObjectType({
        name: 'GeoJSONPoint',
        description: 'Object describing a single geographical point.',
        fields: {
          type: { type: GraphQLString },
          coordinates: { type: CoordinatesScalar }
        }
      })
    }
  }
})

const TopLevelStatusCodes = new GraphQLEnumType({
  name: 'TopLevelStatusCodes',
  values: {
    OK: {
      value: 'OK',
      description: 'Indicates the response contains a valid result.'
    },
    INVALID_REQUEST: {
      value: 'INVALID_REQUEST',
      description: 'Indicates that the provided request was invalid.'
    },
    MAX_ELEMENTS_EXCEEDED: {
      value: 'MAX_ELEMENTS_EXCEEDED',
      description:
        'Indicates that the product of origins and destinations exceeds the per-query limit.'
    },
    OVER_QUERY_LIMIT: {
      value: 'OVER_QUERY_LIMIT',
      description:
        'Indicates the service has received too many requests from your application within the allowed time period.'
    },
    REQUEST_DENIED: {
      value: 'REQUEST_DENIED',
      description:
        'Indicates that the service denied use of the Distance Matrix service by your application.'
    },
    UNKNOWN_ERROR: {
      value: 'UNKNOWN_ERROR',
      description:
        'Indicates a Distance Matrix request could not be processed due to a server error. The request may succeed if you try again.'
    }
  }
})

const ElementLevelStatusCodes = new GraphQLEnumType({
  name: 'ElementLevelStatusCodes',
  values: {
    OK: {
      value: 'OK',
      description: 'Indicates the response contains a valid result.'
    },
    NOT_FOUND: {
      value: 'NOT_FOUND',
      description:
        'Indicates that the origin and/or destination of this pairing could not be geocoded.'
    },
    ZERO_RESULTS: {
      value: 'ZERO_RESULTS',
      description:
        'Indicates no route could be found between the origin and destination.'
    },
    MAX_ROUTE_LENGTH_EXCEEDED: {
      value: 'MAX_ROUTE_LENGTH_EXCEEDED',
      description:
        'Indicates the requested route is too long and cannot be processed.'
    }
  }
})

const DistanceType = new GraphQLObjectType({
  name: 'Distance',
  description: 'Object describing a distance result of matrix api.',
  fields: {
    text: { type: GraphQLString },
    value: { type: GraphQLInt }
  }
})

const DurationType = new GraphQLObjectType({
  name: 'Duration',
  description: 'Object describing a duration result of matrix api.',
  fields: {
    text: { type: GraphQLString },
    value: { type: GraphQLInt }
  }
})

const ElementType = new GraphQLObjectType({
  name: 'Element',
  description: 'Object describing a element result of matrix api.',
  fields: {
    distance: { type: DistanceType },
    duration: { type: DurationType },
    status: { type: ElementLevelStatusCodes }
  }
})

const RowType = new GraphQLObjectType({
  name: 'Row',
  description: 'Object describing a row result of matrix api.',
  fields: {
    elements: { type: new GraphQLList(ElementType) }
  }
})

exports.DistanceMatrixResults = new GraphQLObjectType({
  name: 'DistanceMatrixResults',
  fields: {
    destination_addresses: {
      type: new GraphQLList(GraphQLString)
    },
    origin_addresses: {
      type: new GraphQLList(GraphQLString)
    },
    rows: {
      type: new GraphQLList(RowType)
    },
    status: { type: TopLevelStatusCodes }
  }
})

exports.TravelModes = new GraphQLEnumType({
  name: 'TravelModes',
  description:
    'Specifies the mode of transport to use when calculating distance.',
  values: {
    driving: {
      value: 'driving',
      description: 'Indicates distance calculation using the road network.'
    },
    walking: {
      value: 'walking',
      description:
        'Requests distance calculation for walking via pedestrian paths & sidewalks (where available).'
    },
    bicycling: {
      value: 'bicycling',
      description:
        'Requests distance calculation for bicycling via bicycle paths & preferred streets (where available).'
    },
    transit: {
      value: 'transit',
      description:
        'Requests distance calculation via public transit routes (where available).'
    }
  }
})

exports.Languages = new GraphQLEnumType({
  name: 'Languages',
  description: 'The language in which to return results.',
  values: {
    ar: { value: 'ar', description: 'Arabic' },
    bg: { value: 'bg', description: 'Bulgarian' },
    bn: { value: 'bn', description: 'Bengali' },
    ca: { value: 'ca', description: 'Catalan' },
    cs: { value: 'cs', description: 'Czech' },
    da: { value: 'da', description: 'Danish' },
    de: { value: 'de', description: 'German' },
    el: { value: 'el', description: 'Greek' },
    en_AU: { value: 'en-AU', description: 'English (Australian)' },
    en_GB: { value: 'en-GB', description: 'English (Great Britain)' },
    en: { value: 'en', description: 'English' },
    es: { value: 'es', description: 'Spanish' },
    eu: { value: 'eu', description: 'Basque' },
    fa: { value: 'fa', description: 'Farsi' },
    fi: { value: 'fi', description: 'Finnish' },
    fil: { value: 'fil', description: 'Filipino' },
    fr: { value: 'fr', description: 'French' },
    gl: { value: 'gl', description: 'Galician' },
    gu: { value: 'gu', description: 'Gujarati' },
    hi: { value: 'hi', description: 'Hindi' },
    hr: { value: 'hr', description: 'Croatian' },
    hu: { value: 'hu', description: 'Hungarian' },
    id: { value: 'id', description: 'Indonesian' },
    it: { value: 'it', description: 'Italian' },
    iw: { value: 'iw', description: 'Hebrew' },
    ja: { value: 'ja', description: 'Japanese' },
    ko: { value: 'ko', description: 'Korean' },
    lt: { value: 'lt', description: 'Lithuanian' },
    lv: { value: 'lv', description: 'Latvian' },
    ml: { value: 'ml', description: 'Malayalam' },
    mr: { value: 'mr', description: 'Marathi' },
    nl: { value: 'nl', description: 'Dutch' },
    no: { value: 'no', description: 'Norwegian' },
    pl: { value: 'pl', description: 'Polish' },
    pt_BR: { value: 'pt-BR', description: 'Portuguese (Brazil)' },
    pt_PT: { value: 'pt-PT', description: 'Portuguese (Portugal)' },
    pt: { value: 'pt', description: 'Portuguese' },
    ro: { value: 'ro', description: 'Romanian' },
    ru: { value: 'ru', description: 'Russian' },
    sk: { value: 'sk', description: 'Slovak' },
    sl: { value: 'sl', description: 'Slovenian' },
    sr: { value: 'sr', description: 'Serbian' },
    sv: { value: 'sv', description: 'Swedish' },
    ta: { value: 'ta', description: 'Tamil' },
    te: { value: 'te', description: 'Telugu' },
    th: { value: 'th', description: 'Thai' },
    tl: { value: 'tl', description: 'Tagalog' },
    tr: { value: 'tr', description: 'Turkish' },
    uk: { value: 'uk', description: 'Ukrainian' },
    vi: { value: 'vi', description: 'Vietnamese' },
    zh_CN: { value: 'zh-CN', description: 'Chinese (Simplified)' },
    zh_TW: { value: 'zh-TW', description: 'Chinese (Traditional)' }
  }
})

exports.Avoids = new GraphQLEnumType({
  name: 'Avoids',
  description: 'Introduces restrictions to the route.',
  values: {
    tolls: { value: 'tolls' },
    highways: { value: 'highways' },
    ferries: { value: 'ferries' },
    indoor: { value: 'indoor' }
  }
})

exports.Units = new GraphQLEnumType({
  name: 'Units',
  description:
    'Specifies the unit system to use when expressing distance as text.',
  values: {
    metric: { value: 'metric' },
    imperial: { value: 'imperial' }
  }
})

exports.TimeType = new GraphQLEnumType({
  name: 'TimeType',
  description: 'Specifies the type of desired time.',
  values: {
    arrival_time: {
      value: 'arrival_time',
      description:
        'Specifies the desired time of arrival for transit requests, in seconds since midnight, January 1, 1970 UTC.'
    },
    departure_time: {
      value: 'departure_time',
      description:
        'The desired time of departure. You can specify the time as an integer in seconds since midnight, January 1, 1970 UTC. Alternatively, you can specify a value of now, which sets the departure time to the current time (correct to the nearest second).'
    }
  }
})

exports.TrafficModels = new GraphQLEnumType({
  name: 'TrafficModels',
  description:
    'Specifies the assumptions to use when calculating time in traffic.',
  values: {
    best_guess: {
      value: 'best_guess',
      description:
        'Indicates that the returned duration_in_traffic should be the best estimate of travel time given what is known about both historical traffic conditions and live traffic.'
    },
    pessimistic: {
      value: 'pessimistic',
      description:
        'Indicates that the returned duration_in_traffic should be longer than the actual travel time on most days, though occasional days with particularly bad traffic conditions may exceed this value.'
    },
    optimistic: {
      value: 'optimistic',
      description:
        'Indicates that the returned duration_in_traffic should be shorter than the actual travel time on most days, though occasional days with particularly good traffic conditions may be faster than this value.'
    }
  }
})

exports.TransitModes = new GraphQLEnumType({
  name: 'TransitModes',
  description: 'Specifies one or more preferred modes of transit.',
  values: {
    bus: {
      value: 'bus',
      description:
        'Indicates that the calculated route should prefer travel by bus.'
    },
    subway: {
      value: 'subway',
      description:
        'Indicates that the calculated route should prefer travel by subway.'
    },
    train: {
      value: 'train',
      description:
        'Indicates that the calculated route should prefer travel by train.'
    },
    tram: {
      value: 'tram',
      description:
        'Indicates that the calculated route should prefer travel by tram and light rail.'
    },
    rail: {
      value: 'rail',
      description:
        'Indicates that the calculated route should prefer travel by train, tram, light rail, and subway. This is equivalent to transit_mode=train|tram|subway.'
    }
  }
})

exports.TransitRoutingPreference = new GraphQLEnumType({
  name: 'TransitRoutingPreference',
  description: 'Specifies preferences for transit requests.',
  values: {
    less_walking: {
      value: 'less_walking',
      description:
        'Indicates that the calculated route should prefer limited amounts of walking.'
    },
    fewer_transfers: {
      value: 'fewer_transfers',
      description:
        'Indicates that the calculated route should prefer a limited number of transfers.'
    }
  }
})
