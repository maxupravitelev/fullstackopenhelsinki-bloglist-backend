// https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#testing-node-applications

const mongoose = require('mongoose')

const app = require('./app') 
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
