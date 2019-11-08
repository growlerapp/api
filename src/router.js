'use strict'

const { ApolloServer } = require('apollo-server-express')
const schema = require('./schema')

module.exports = app => {
  /** @type {import('@sentry/node')} */
  const Sentry = app.get('Sentry')
  const graphqlPath = '/graphql'
  /** @type {import('apollo-server-express').ApolloServerExpressConfig} */
  const options = {
    schema,
    context: ({ req }) => ({
      req
    }),
    playground: true,
    introspection: true,
    formatError: err => {
      Sentry.captureException(err.originalError)
      return err
    }
  }
  app.get('/', (req, res) => res.redirect(graphqlPath))
  const server = new ApolloServer(options)
  server.applyMiddleware({ app, path: graphqlPath })
}
