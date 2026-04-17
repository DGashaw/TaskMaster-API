const { createNewTask, getAllTasks, updateTaskById, removeTaskById } = require('../database/database')
const validator = require('validator');

const debug = require('debug')('taskMaster:controller:taskApiController')

const createTask = async (request, response, next) => {
  response.set({ 'content-type': 'json' })
  try {
    if (request?.body?.name) {
      let responseObject = await createNewTask(request.body.name)
      response.status(201)
      response.json(responseObject)
    } else {
      const error = new Error('No todo item found in the body')
      error.status = 400
      return next(error)
    }
  } catch (error) {
    error.status = error.status || 500
    return next(error)
  }
}

const getTasks = async (request, response, next) => {
  response.set({ 'content-type': 'application/json' })
  try {
    let filter = {}
    if (request?.params?.id) {
      const id = request.params.id.toString().trim()
      if(validator.isMongoId(id)) {
        filter = { _id: id }

        let responseObject = await getAllTasks(filter)
        if (responseObject[0]?._id) {
          response.status(200)
          response.json(responseObject)
        } else {
          const error = new Error('Task not found')
          error.status = 404
          return next(error)
        }
      } 
      else {
        const error = new Error('Invalid object id')
        error.status = 400
        return next(error)
      }
    } else {
      // Get all tasks when no ID is provided
      let responseObject = await getAllTasks(filter)
      response.status(200)
      response.json(responseObject)
    }
  } catch (error) {
    error.status = error.status || 500
    return next(error)
  }

}

const updateTask = async (request, response, next) => {
  response.set({ 'content-type': 'application/json' })
  try {
    const id = request.params?.id.toString().trim()
    const updateObject = request?.body

    if (!id) {
      const error = new Error('Missing object id')
      error.status = 400
      return next(error)
    } 
    else if (!updateObject) {
      const error = new Error('Missing update object')
      error.status = 400
      return next(error)
    } 
    else {
      if (!validator.isMongoId(id)) {
        const error = new Error('Invalid object id')
        error.status = 400
        return next(error)
      }

      let responseObject = await updateTaskById(id, updateObject)
      if (!responseObject?._id) {
        const error = new Error('Task not found')
        error.status = 404
        return next(error)
      } else {
        response.status(200)
        response.json(responseObject)
      }
    }
  } 
  catch (error) {
    error.status = error.status || 500
    return next(error)
  }
}

const deleteTask = async (request, response, next) => {
  response.set({ 'content-type': 'application/json' })
  try {
    const id = request?.params?.id
    if (!id) {
      const error = new Error('Missing object id')
      error.status = 400
      return next(error)
    } 
    else {
      if (!validator.isMongoId(id)) {
        const error = new Error('Invalid object id')
        error.status = 400
        return next(error)
      }

      let responseObject = await removeTaskById(id)
      if (!responseObject?._id) {
        const error = new Error('Task not found')
        error.status = 404
        return next(error)
      } 
      else {
        response.status(200)
        response.json(responseObject)
      }
    }
  } catch (error) {
    error.status = error.status || 500
    return next(error)
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask

}
