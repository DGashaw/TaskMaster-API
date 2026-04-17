const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const debug = require('debug')('taskMaster:database:dbConnect')

// const enviroment = process.env.NODE_ENV

const connectToDatabase = async (enviroment) => {
  if (enviroment === 'development') {
    try {
      await mongoose.connect(process.env.MONGODB_DEVELOPMENT_CONNECTION_STR)
      /* mongoose.connection.on('connected', () => {
      console.log('Successfully connected to the database');
      }) */
      return 'database connected'
    } catch (error) {
      throw new Error(error)
    }
  } else if (enviroment === 'production') {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      return 'database connected'
    } catch (error) {
      throw new Error(error)
    }
  } else if (enviroment === 'test') {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    return mongoServer
  } else {
    return new Error('Invalid enviroment variable')
  }
}

const disconnectFromDatabase = async (enviroment, mongoServer = null) => {
  if (enviroment === 'test') {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  } else {
    let connection = null
    try {
      connection = await mongoose.connection.close()
      console.log('Successfully disconnected from the database')
      return connection
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase }
