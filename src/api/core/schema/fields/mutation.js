'use strict'

const { GraphQLNonNull } = require('graphql')
const { GrowlerType, UploadBarInput } = require('../type')
const { uploadBar } = require('../resolvers')

exports.uploadBar = {
  type: GrowlerType,
  args: {
    input: { type: new GraphQLNonNull(UploadBarInput) }
  },
  resolve: uploadBar
}
