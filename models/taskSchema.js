const mongoose = require('mongoose')
const { model } = mongoose
const { Schema } = mongoose

const todoSchema = new Schema({
  name: String,
  completed: Boolean
},
{
  timestamps: true
})

const Task = model('Todo', todoSchema)

module.exports = { Task }
