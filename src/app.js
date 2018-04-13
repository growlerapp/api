'use strict'

const os = require('os')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Raven = require('raven')
const config = require('./config')
const pkg = require('../package.json')

const router = require('./router')

mongoose.connect(config.db)
mongoose.Promise = Promise

const app = express()

Raven.config(
  process.env.SENTRY_TOKEN,
  {
    release: pkg.version,
    environment: process.env.NODE_ENV || 'development',
    server_name: process.env.HOSTNAME || os.hostname(),
    captureUnhandledRejections: true,
    autoBreadcrumbs: true
  }
).install()

app.use(Raven.requestHandler())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

router(app)

app.use(Raven.errorHandler())
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line
  res.sendStatus(500)
})

module.exports = app
