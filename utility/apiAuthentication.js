const apiAuthenticationRequired = (req, res, next) => {
  if (process.env.API_KEY !== req.headers['x-api-key']) {
    let error = new Error('Invalid API key')
    error.status = 401
    return next(error)
  }
  next()
}

module.exports = { apiAuthenticationRequired }