'use strict'

const http = require('http')
const mongoose = require('mongoose')
const terminus = require('@godaddy/terminus')
const app = require('./app')
const { port } = require('./config')

const server = http.createServer(app)

/**
 * Metodo encargado ejecutar tareas previas a terminar la aplicación
 */
async function onSignal () {
  await mongoose.connection.close()
}

/**
 * Metodo encargado de verificar que la aplicación este viva
 */
async function onHealthCheck () {
  return mongoose.connection.readyState === 1
}

const options = {
  healthChecks: { '/healthcheck': onHealthCheck },
  timeout: 1000,
  signal: process.env.HEALTHCHECK_SIGNAL || 'SIGINT',
  onSignal
}
terminus(server, options)

server.listen(port)
console.log(`Listen in port ${port}`) // eslint-disable-line
