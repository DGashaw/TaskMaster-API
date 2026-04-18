/* eslint-env mocha */
const request = require('supertest')
const { expect } = require('chai')
const { app } = require('../app')

describe('GET / in test mode', () => {
  it('should return a page not found error for uknown route', async () => {
    const response = await request(app)
      .get('/personal')
    expect(response.statusCode).to.equal(404)
  })
  it('should return a internal server error for wrong formatted request body', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('x-api-key', process.env.API_KEY)
      .send({ name: { firstName: 'Daniel', lastName: 'Gashaw' } })

    expect(response.statusCode).to.equal(500)
  })
})
