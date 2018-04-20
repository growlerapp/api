'use strict'

const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const request = require('supertest')
const app = require('../src/app')
const { port } = require('../src/config')
const Growler = require('../src/api/core/model')
const data = require('../db.json')

describe('api', function () {
  before(async () => {
    try {
      app.listen(port)
    } catch (err) {
      throw err
    }
    await Growler.insertMany(data)
  })

  describe('static', () => {
    it('GET /', async () => {
      const response = await request(app)
        .get('/')
        .expect(302)
      expect(response.headers.location).to.equal('/playground')
    })

    it('GET /not-found', async () => {
      await request(app)
        .get('/not-found')
        .expect(404)
    })
  })

  describe('query findAll', () => {
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
      response.body.data.findAll.forEach(doc => {
        expect(doc.name).to.be.a('string')
        expect(doc.address).to.be.a('string')
        expect(doc.geometry.type).to.be.a('string')
        expect(doc.geometry.coordinates).to.be.a('array')
        doc.geometry.coordinates.forEach(point => {
          expect(point).to.be.a('number')
        })
      })
      expect(response.body.errors).to.be.a('undefined')
    })

    it('search by name', async () => {
      const query = `
      query {
        findAll(name: "cerveceria") {
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
      response.body.data.findAll.forEach(doc => {
        expect(doc.name).to.be.a('string')
        expect(doc.address).to.be.a('string')
        expect(doc.geometry.type).to.be.a('string')
        expect(doc.geometry.coordinates).to.be.a('array')
        doc.geometry.coordinates.forEach(point => {
          expect(point).to.be.a('number')
        })
      })
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
      response.body.data.findAll.forEach(doc => {
        expect(doc.name).to.be.a('string')
        expect(doc.address).to.be.a('string')
        expect(doc.geometry.type).to.be.a('string')
        expect(doc.geometry.coordinates).to.be.a('array')
        doc.geometry.coordinates.forEach(point => {
          expect(point).to.be.a('number')
        })
      })
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

  after(async () => {
    await Growler.remove().exec()
  })
})
