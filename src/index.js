'use strict'

const app = require('./app')
const { port } = require('./config')

app.listen(port, () => {
  console.log(`Listen in port ${port}`) // eslint-disable-line
})
