const Task = require('../models/taskSchema')

const createTask = async (request, response) => {
  response.set({ 'content-type': 'json' })
  let responseObject = null

  if (process.env.API_KEY !== request.headers['x-api-key']) {
    response.status(401)
    responseObject = { error: new Error('Inavlid API Key') }
  } else {
    try {
      if (request?.body?.name) {
        const task = new Task({ ...request.body, completed: false })

        responseObject = await task.save()
        response.status(201)
      } else {
        response.status(400)
        responseObject = { error: new Error('No todo item found in the body') }
      }
    } catch (error) {
      responseObject = { error }
      response.status(500)
    }
  }

  response.send(responseObject)
}

const getTasks = async (request, response) => {
  response.set({ 'content-type': 'application/json' })
  let responseObject = null

  if (process.env.API_KEY !== request.headers['x-api-key']) {
    response.status(401)
    responseObject = { error: new Error('Inavlid API Key') }
  } else {
    try {
      let filter = {}
      if (request?.params?.id) {
        const id = request.params.id.toString().trim()
        filter = { _id: id }
      }

      responseObject = await Task.find(filter)
      response.statusCode = responseObject[0]._id ? 200 : 404
    } catch (error) {
      response.status(500)
      responseObject = { error }
    }
  }

  response.send(responseObject)
}

const updateTask = async (request, response) => {
  response.set({ 'content-type': 'application/json' })
  responseObject = null

  if (process.env.API_KEY !== request.headers['x-api-key'].toString().trim()) {
    response.status(401)
    responseObject = { error: new Error('Inavlid API Key') }
  } else {
    try {
      const id = request.params?.id.toString().trim()
      const updateObject = request?.body

      if (!id && !updateObject) {
        responseObject = { error: new Error('Missing object id or update object') }
      } else {
        responseObject = await Task.findByIdAndUpdate({ _id: id }, { $set: updateObject }, { returnDocument: 'after', upsert: false })
      }
      response.statusCode = responseObject?._id ? 200 : 404
    } catch (error) {
      responseObject = { error }
      response.statusCode = 500
    }
  }

  response.send(responseObject)
}

const deleteTask = async (request, response) => {
  if (process.env.API_KEY !== request.headers['x-api-key']) {
    response.status(401)
    responseObject = { error: new Error('Inavlid API Key') }
  } else {
    try {
      const id = request?.params?.id
      if (!id) {
        responseObject = { error: new Error('Missing object id') }
      } else {
        responseObject = await Task.findByIdAndDelete(id)
      }

      response.statusCode = responseObject?.name ? 200 : 404
    } catch (error) {
      response.status(500)
      responseObject = { error }
    }
  }
  response.send(responseObject)
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask

}
