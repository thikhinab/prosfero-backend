const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

//Authentication
require('./auth/auth')


// Middleware
app.use(express.json())

// CorsOptions
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

// Database Connection
const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
const connection = mongoose.connection
connection.once('open', () => {
    console.log("Mongo database connection established successfully")
})


// Routes used
const usersRouter = require('./routes/users')
app.use('/api/v1/users', usersRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
