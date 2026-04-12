const mongoose = require('mongoose')
const DEBUG = require('debug')

const enviroment = process.env.NODE_ENV

if (enviroment === 'development') {
  try {
    mongoose.connect(process.env.MONGODB_DEVELOPMENT_CONNECTION_STR)
    console.log('Successfully connected to the database')
  } catch (error) {
    throw new Error(error)
  }
} else if (enviroment === 'production') {
  mongoose.connect(process.env.MONGODB_URI)
  console.log('Successfully connected to the database')
}
