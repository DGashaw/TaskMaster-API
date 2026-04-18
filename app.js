const express = require('express')
const bodyParser = require('body-parser')
const taskApiRoutes = require('./routes/taskApiRoutes.js')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('node:path')
const cors = require('cors')

const app = express()
const { apiAuthenticationRequired } = require('./utility/apiAuthentication.js')

let databaseStatus = null

require('dotenv').config()
const { connectToDatabase } = require('./config/dbConnect.js')

if (process.env.NODE_ENV !== 'test') {
  databaseStatus = connectToDatabase(process.env.NODE_ENV)
}

const corsOptions = {
  origin: '*',
  methods: 'GET,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(bodyParser.json())
app.use(cors(corsOptions))

switch (app.get('env')) {
  case 'development': {
    app.use(morgan(process.env.REQUEST_LOG_FORMAT || 'dev', {
      stream: process.env.REQUEST_LOG_FILE
        ? rfs.RotatingFileStream(path.join(__dirname, process.env.REQUEST_LOG_FILE),
          {
            size: '10M', // rotate every 10 MegaBytes written
            interval: '1d', // rotate daily
            compress: 'gzip'

          })
        : process.stdout

    }))
    break
  }
  case 'production': {
    const stream = rfs.createStream(process.env.REQUEST_LOG_FILE, {
      size: '10M', // rotate every 10 MegaBytes written
      interval: '1d', // rotate daily
      compress: 'gzip'
    })
    app.use(morgan, { stream })
    break
  }
}
app.use('/api/v1', apiAuthenticationRequired, taskApiRoutes)

app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, request, response, next) => {
  response.status(error.status || 500)
  next(error)
})

const env = app.get('env')
if (env === 'development' || env === 'test') {
  app.set('content-type', 'application/json')
  app.use((error, request, response, next) => {
    response.json({
      error: {
        message: error.message,
        stack: error.stack
      }
    })
  })
} else if (env === 'production') {
  app.use((error, request, response, next) => {
    response.json({
      error: {
        message: error.message
      }
    })
  })
};

module.exports = { app, databaseStatus }
