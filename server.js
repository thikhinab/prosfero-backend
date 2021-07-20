const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('passport')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

//Authentication
require('./auth/auth')


// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

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

const profileRouter = require('./routes/profile')
app.use('/api/v1/profile', passport.authenticate('jwt', { session: false }), profileRouter)

const postsRouter = require("./routes/posts");
app.use("/api/v1/posts", passport.authenticate('jwt', { session: false }), postsRouter);

const requestsRouter = require("./routes/requests");
app.use("/api/v1/requests", passport.authenticate('jwt', { session: false }), requestsRouter);

const botRouter = require("./routes/telebots")
app.use("/api/v1/telebots", passport.authenticate('jwt', { session: false }), botRouter);

const bot = require("./telebot");
bot.start()


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
