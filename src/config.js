'use strict'

const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ silent: true, path: path.join(__dirname, '..', '.env') })

module.exports = {
  db: process.env.MONGODB_URI || 'mongodb://localhost/growler',
  google: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY
  },
  uber: {
    clientId: process.env.UBER_CLIENT_ID
  }
}
