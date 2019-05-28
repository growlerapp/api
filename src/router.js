'use strict'

const { ApolloServer } = require('apollo-server-express')
const schema = require('./schema')

module.exports = app => {
  const graphqlPath = '/graphql'
  /** @type {import('apollo-server-express').ApolloServerExpressConfig} */
  const options = {
    schema,
    context: ({ req }) => ({
      req
    })
  }
  app.get('/', (req, res) => res.redirect(graphqlPath))
  const server = new ApolloServer(options)
  server.applyMiddleware({ app, path: graphqlPath })
}
