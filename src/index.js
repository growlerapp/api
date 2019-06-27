'use strict'

const http = require('http')
const mongoose = require('mongoose')
const { createTerminus } = require('@godaddy/terminus')
const app = require('./app')
const { port } = require('./config')

const server = http.createServer(app)

/**
 * Metodo encargado ejecutar tareas previas a terminar la aplicación.
 *
 * @example
 * await onSignal()
 * @returns {Promise<any>} -
 */
async function onSignal () {
  await mongoose.connection.close()
}

/**
 * Metodo encargado de verificar que la aplicación este viva.
 *
 * @example
 * await onHealthCheck()
 * @returns {Promise<any>} -
 */
async function onHealthCheck () {
  await Promise.resolve(mongoose.connection.readyState === 1)
}

const options = {
  healthChecks: { '/healthcheck': onHealthCheck },
  timeout: 1000,
  signal: process.env.HEALTHCHECK_SIGNAL || 'SIGINT',
  onSignal
}
createTerminus(server, options)

server.listen(port)
console.log(`Listen in port ${port}`) // eslint-disable-line no-console
