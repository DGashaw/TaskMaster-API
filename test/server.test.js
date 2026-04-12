const request = require('supertest')
const { expect, assert } = require('chai')
const { app } = require('../app')
const { mongoose } = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer = null
let name = null
let id = null

describe('POST /api/v1/tasks', () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  })

  it('should create a new todo item when the api-key is correct', async () => {
    name = 'Walking the dog'

    const response = await request(app)
      .post('/api/v1/tasks')
      .set('x-api-key', process.env.API_KEY)
      .send({ name })
    id = await response.body._id

    expect(response.statusCode)
      .to.equal(201)
    expect(response.body.name)
      .to.be.a('string')
      .to.equal(name)
  })

  it('should not create a new todo item for empty task', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('x-api-key', process.env.API_KEY)
      .send({})

    expect(response.statusCode)
      .to.equal(400)
    expect(response.body)
      .to.be.a('object')
  })

  it('should not create a new todo item for incorrect/empty api-key', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('x-api-key', '')
      .send({ name })

    expect(response.statusCode).to.equal(401)
  })
})

describe('GET /api/v1/tasks', () => {
  it('should get all todo items', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('x-api-key', process.env.API_KEY)

    expect(response.statusCode)
      .to.equal(200)
    expect(response.body)
      .to.have.lengthOf(1)
    expect(response.body[0])
      .to.have.ownProperty('createdAt')
  })

  it('should get a todo by its id', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${id}`)
      .set('x-api-key', process.env.API_KEY)

    expect(response.statusCode)
      .to.equal(200)
    expect(response.body[0].name)
      .to.be.a('string')
      .to.equal(name)
  })

  it('should not get any tasks for invalid/empty api-key', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${id}`)
      .set('x-api-key', 'wrong-api-key')

    expect(response.statusCode)
      .to.equal(401)

    assert.ifError(response.text.error)
    assert.notPropertyVal(response, 'body')
  })
})

describe('PATCH /api/v1/tasks/:id', () => {
  it('should update the task with the specified for the valid api-key', async () => {
    // should();

    name = 'postman updated task'
    const response = await request(app)
      .patch(`/api/v1/tasks/${id}`)
      .set('x-api-key', process.env.API_KEY)
      .send({ name })

    expect(response.statusCode).to.equal(200)
    expect(response.body.name).to.equal(name)
  })

  it('should not update the task with a wrong/undefined id', async () => {
    newId = new mongoose.Types.ObjectId()

    newName = 'postman second updated task'

    const response = await request(app)
      .patch(`/api/v1/tasks/${newId}`)
      .set('x-api-key', process.env.API_KEY)
      .send({ name: newName })

    expect(response.statusCode).to.equal(404)
    expect(response.body).to.equal('')
  })

  it('should not update a task with empty/invalid api-key', async () => {
    const response = await request(app)
      .patch(`/api/v1/tasks/${id}`)
      .set('x-api-key', 'invalid-api-key')

    expect(response.statusCode).to.equal(401)
    assert.ifError(response.text.error)
  })
})

describe('DELETE /api/v1/tasks/:id', () => {
  it('should not delete a task with uknown id', async () => {
    const newId = new mongoose.Types.ObjectId()

    const response = await request(app)
      .delete(`/api/v1/tasks/${newId}`)
      .set('x-api-key', process.env.API_KEY)

    expect(response.statusCode).to.equal(404)
  })

  it('should not delete a task with specified id with wrong/empty api-key', async () => {
    const response = await request(app)
      .delete(`/api/v1/tasks/${id}`)
      .set('x-api-key', 'todo-api-key')

    expect(response.statusCode).to.equal(401)
  })

  it('should delete a task with a known id and correct api-key', async () => {
    const response = await request(app)
      .delete(`/api/v1/tasks/${id}`)
      .set('x-api-key', process.env.API_KEY)

    expect(response.statusCode).to.equal(200)
    expect(response.body._id).to.equal(id)
  })

  after(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })
})
