const { connectToDatabase, disconnectFromDatabase } = require('../config/dbConnect.js')
const request = require('supertest')
const { expect, assert } = require('chai')
const { app } = require('../app')
const debug = require('debug')('taskMaster:test:database.test')

let databaseStatus = null
let currentEnviroment = null

describe('Database Connection and routes in development mode', () => {
  before(async () => {
    currentEnviroment = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    databaseStatus = await connectToDatabase(process.env.NODE_ENV)
  })

  it('should connect to the database successfully', () => {
    expect(databaseStatus).to.equal('database connected')
  })

  it('should return a page not found error for uknown route', async () => {
    const response = await request(app)
      .get('/personal')
    expect(response.statusCode).to.equal(404)
    expect(response.body.error).to.be.a('object')
    expect(response.body.error.message).to.be.equal('Not Found')
  })

  after(async () => {
    await disconnectFromDatabase('development')
    process.env.NODE_ENV = currentEnviroment
  })
})

describe('Database connection for wrong enviroment variable', () => {
  before(async () => {
    error = await connectToDatabase('wrong')
  })

  it('should not connect to the database', () => {
    expect(error).to.be.an('error')
  })
})
