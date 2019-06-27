'use strict'

const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const request = require('supertest')
const app = require('../src/app')
const { port } = require('../src/config')
const Growler = require('../src/api/core/model')
// @ts-ignore
const data = require('../db.json')

describe('api', function () {
  let doc
  before(async () => {
    app.listen(port)
    await Growler.insertMany(data)
    const docs = await Growler.find({}, { _id: 1 })
      .limit(1)
      .exec()
    doc = docs[0]
  })

  describe('static', () => {
    it('GET /', async () => {
      const response = await request(app)
        .get('/')
        .expect(302)
      expect(response.headers.location).to.equal('/graphql')
    })

    it('GET /not-found', async () => {
      await request(app)
        .get('/not-found')
        .expect(404)
    })
  })

  describe('query findAll', () => {
    // @ts-ignore
    // eslint-disable-next-line require-jsdoc
    const checkDoc = doc => {
      expect(doc.name).to.be.a('string')
      expect(doc.address).to.be.a('string')
      expect(doc.geometry.type).to.be.a('string')
      expect(doc.geometry.coordinates).to.be.a('array')
      doc.geometry.coordinates.forEach(point => {
        expect(point).to.be.a('number')
      })
    }

    it('success', async () => {
      const query = `
      query {
        findAll {
          name, address, geometry {
            type, coordinates
          }
        }
      }`
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
      expect(response.body.data.findAll).to.be.a('array')
      response.body.data.findAll.forEach(checkDoc)
      expect(response.body.errors).to.be.a('undefined')
    })

    it('search by name', async () => {
      const query = `
      query {
        findAll(name: "Kunstmann") {
          name, address, geometry {
            type, coordinates
          }
        }
      }`
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
      expect(response.body.data.findAll).to.be.a('array')
      response.body.data.findAll.forEach(checkDoc)
      expect(response.body.errors).to.be.a('undefined')
    })

    it('search by address', async () => {
      const query = `
      query {
        findAll(address: "Metropolitana") {
          name, address, geometry {
            type, coordinates
          }
        }
      }`
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
      expect(response.body.data.findAll).to.be.a('array')
      response.body.data.findAll.forEach(checkDoc)
      expect(response.body.errors).to.be.a('undefined')
    })

    it('bad request', async () => {
      const query = `
      query {
        findAll
      }`
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(400)
    })
  })

  describe('query findOne', () => {
    it('success', async () => {
      const query = `
      query {
        findOne(_id: "${doc._id}") {
          name, address, geometry {
            type, coordinates
          }
        }
      }`
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200)
      expect(response.body.data.findOne).to.be.a('object')
      expect(response.body.data.findOne.name).to.be.a('string')
      expect(response.body.data.findOne.address).to.be.a('string')
      expect(response.body.data.findOne.geometry.type).to.be.a('string')
      expect(response.body.data.findOne.geometry.coordinates).to.be.a('array')
      response.body.data.findOne.geometry.coordinates.forEach(point => {
        expect(point).to.be.a('number')
      })
      expect(response.body.errors).to.be.a('undefined')
    })

    it('bad request', async () => {
      const query = `
      query {
        findOne
      }`
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(400)
    })
  })

  after(async () => {
    const docs = await Growler.find({}, { _id: 1 }).exec()
    await Growler.deleteMany({ _id: { $in: docs.map(({ _id }) => _id) } })
  })
})
