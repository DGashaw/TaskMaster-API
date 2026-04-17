const { Task } = require('../models/taskSchema')

const createNewTask = async (name) => {
  const newTask = new Task({
    name,
    completed: false
  })
  const result = await newTask.save()
  return result
}

const getAllTasks = async (filter) => {
  const result = await Task.find(filter)
  return result
}

const updateTaskById = async (id, update) => {
  const result = await Task.findByIdAndUpdate(id, update, { returnDocument: 'after' })
  return result
}

const removeTaskById = async (id) => {
  const result = await Task.findByIdAndDelete(id)
  return result
}

module.exports = {
  createNewTask,
  getAllTasks,
  updateTaskById,
  removeTaskById
}
