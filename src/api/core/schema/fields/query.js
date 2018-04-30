'use strict'

const {
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql')
const {
  GrowlerType,
  SimpleMatrix,
  TravelModes,
  Languages,
  Avoids,
  Units,
  TimeType,
  TrafficModels,
  TransitModes,
  TransitRoutingPreference
} = require('../type')
const { findAll, findByProximity } = require('../resolvers')

exports.findAll = {
  type: new GraphQLList(GrowlerType),
  args: {
    name: {
      type: GraphQLString,
      description: 'Búsqueda de growlers por nombre'
    },
    address: {
      type: GraphQLString,
      description: 'Búsqueda de growlers por dirección'
    }
  },
  resolve: findAll
}

exports.findByProximity = {
  type: new GraphQLList(SimpleMatrix),
  args: {
    latitude: { type: new GraphQLNonNull(GraphQLFloat) },
    longitude: { type: new GraphQLNonNull(GraphQLFloat) },
    mode: {
      type: TravelModes,
      description:
        'Especifica el medio de transporte que se debe usar para calcular la distancia.',
      defaultValue: 'driving'
    },
    language: {
      type: Languages,
      description: 'El idioma en el que se devolverán los resultados.',
      defaultValue: 'es'
    },
    avoid: {
      type: Avoids,
      description: 'Introduce restricciones para la ruta.'
    },
    units: {
      type: Units,
      description:
        'Especifica el sistema de unidades que se usará para expresar la distancia como texto.',
      defaultValue: 'metric'
    },
    time_type: {
      type: new GraphQLNonNull(TimeType),
      description: 'Especifica el tipo de hora deseada.'
    },
    time_value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Especifica el valor de hora deseada.'
    },
    traffic_model: {
      type: TrafficModels,
      description:
        'Especifica las suposiciones que deben aplicarse al calcular el tiempo con tráfico.',
      defaultValue: 'best_guess'
    },
    transit_mode: {
      type: TransitModes,
      description: 'Especifica uno o más medios de transporte.'
    },
    transit_routing_preference: {
      type: TransitRoutingPreference,
      description: 'Especifica preferencias para solicitudes de transporte.'
    },
    max_distance: {
      type: GraphQLFloat,
      description: 'Especifica distancia máxima para buscar en metros.'
    }
  },
  resolve: findByProximity
}
