// Allow us to read dotenv file
require('dotenv').config()

// Set up express app
const path = require('path')
const express = require('express')
const app = express()

// TO-DO: Specify exact permissions needed
// Allow requests from the frontend
const cors = require('cors')
app.use(cors())

// Connect to MongoDB
const mongoose = require('mongoose')
const connection = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to Mongoose!'))

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  favorites: [String],
})

// Defines the model that we will use in the app
const User = mongoose.model('User', UserSchema)

// Set up Express session to track user across sessions
const session = require('express-session')
const MongoStore = require('connect-mongo')
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URI,
  collection: 'sessions',
})

// Utililze sessions for making log ins persistent
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Expires after 1 day
    },
  })
)

//////////////// PASSPORT //////////////////////
// Set up passport for authenticating logins
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')

// Use crypto library to decrypt hash using the salt
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')
  return hash === hashVerify
}

// Create a salt and hash from a regular password
// Store salt and hash instead of password in database for security
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex')
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')

  return {
    salt: salt,
    hash: genHash,
  }
}

// If user found and validated, we call callback to serialize user
// and add it to the req.session.passport object
passport.use(
  new LocalStrategy(function (username, password, callBack) {
    User.findOne({ username: username })
      .then(user => {
        if (!user) return callBack(null, false)

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt)

        if (isValid) return callBack(null, user)
        else return callBack(null, false)
      })
      .catch(err => callBack(err))
  })
)

//
passport.serializeUser(function (user, callBack) {
  callBack(null, user.id)
})

//
passport.deserializeUser(function (id, callBack) {
  User.findById(id, function (err, user) {
    if (err) {
      return callBack(err)
    }
    callBack(null, user)
  })
})

app.use(passport.initialize())
app.use(passport.session())

///////////////// END PASSPORT //////////////////

// Set up middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

// Post data for login here
app.post(
  '/users/login',
  passport.authenticate('local', { failureRedirection: '/login' }),
  (err, req, res, next) => {
    if (err) next(err)
  }
)

// Register
app.post('/users/register', (req, res) => {
  const { username, password } = req.body

  // Validate email

  // Validate password
  // Create a salt and hash from the plaintext password
  const saltHash = genPassword(password)
  const { salt, hash } = saltHash

  // Store the salt and hash in the database
  const newUser = new User({ username, hash, salt, favorites: [] })
  newUser.save().then(user => console.log(user))

  // Redirect to the login page
  res.redirect('/login')
})

app.get('/users/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

// Track any updates to favorites here
const favorites = {}
app.post('/favorites', (req, res) => {
  const { id, isFavorite } = req.body
  favorites[id] = isFavorite
})

// Respond saying if something is a favorite
app.get('/favorites', (req, res) => {
  res.send(favorites)
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  // console.log('test')
  // If not authenticated, redirect to login page
  // if (!req.isAuthenticated()) return res.redirect('/login')

  // Otherwise, send them to the index page
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

// Handle GET requests to /api route
// app.get('/api', (req, res) => {
//   res.json({ message: 'Hello from server!' })
// })

// app.get('/', (req, res) => {
//   console.log('Visiting home page!')
//   console.log(req.session);

//   // If not authenticated, redirect to login page
//   if (!req.isAuthenticated()) return res.redirect('/login')

//   // Otherwise, send them to the index page
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
// })
