'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Sentry = require('@sentry/node')
const helmet = require('helmet')
const config = require('./config')
// @ts-ignore
const pkg = require('../package.json')

const router = require('./router')

mongoose.connect(config.db, { useNewUrlParser: true })
mongoose.Promise = Promise
mongoose.set('useCreateIndex', true)

const app = express()

Sentry.init({
  dsn: process.env.SENTRY_TOKEN,
  release: process.env.SENTRY_RELEASE || pkg.version,
  serverName: process.env.SENTRY_NAME,
  environment: process.env.SENTRY_ENVIRONMENT || config.env
})
app.set('Sentry', Sentry)

// Mejorar seguridad
app.use(helmet())
app.disable('x-powered-by')

app.use(Sentry.Handlers.requestHandler())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

router(app)

app.use(Sentry.Handlers.errorHandler())
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.sendStatus(500)
})

module.exports = app
