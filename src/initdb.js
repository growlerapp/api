'use strict'

// Script para crear la tabla en la base de datos

const mongoose = require('mongoose')
const { db } = require('./config')
const data = require('../db.json')
const Growler = require('./api/core/model')

const init = async () => {
  try {
    mongoose.connect(db)
    mongoose.Promise = Promise
    const total = await Growler.count().exec()
    if (total === 0) {
      await Growler.insertMany(data)
      console.log('Load data') // eslint-disable-line
    }
    process.exit(0)
  } catch (err) {
    console.error(err) // eslint-disable-line
    process.exit(1)
  }
}
init()
