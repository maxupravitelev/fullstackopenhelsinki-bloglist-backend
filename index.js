// const http = require('http')
// const express = require('express')
// const app = express()
// const cors = require('cors')

const mongoose = require('mongoose')

//
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
//



// const mongoUrl = config.MONGODB_URI
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

// app.use(cors())
// app.use(express.json())



// const PORT = 3003
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })