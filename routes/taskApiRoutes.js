const { createTask, getTasks, updateTask, deleteTask } = require('../controller/taskApiController.js')
const express = require('express')
const router = express.Router()

router.route('/tasks', (request, response, next) => {
  next()
})
  .post(createTask)
  .get(getTasks)

router.route('/tasks/:id', (request, response, next) => {
  next()
})
  .get(getTasks)

router.route('/tasks/:id', (request, response, next) => {
  next()
})
  .patch(updateTask)

router.route('/tasks/:id', (request, response, next) => {
  next()
})
  .delete(deleteTask)

module.exports = router
