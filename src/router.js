'use strict'

const { graphqlExpress } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const schema = require('./schema')

module.exports = app => {
  const endpoint = '/graphql'
  app.get('/', async (req, res) => {
    await res.redirect('/playground')
  })
  app.use(
    endpoint,
    graphqlExpress(req => {
      return {
        schema,
        context: { req },
        tracing: true,
        cacheControl: true
      }
    })
  )
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.PLAYGROUND === 'true'
  ) {
    app.use('/playground', expressPlayground({ endpoint }))
  }
}
