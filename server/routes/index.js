const path = require('path')
const router = require('express').Router()
const passport = require('passport')
const genPassword = require('../lib/passwordUtils').genPassword
const connection = require('../config/database')
const User = connection.models.User
const isAuth = require('./authMiddleware').isAuth
const isAdmin = require('./authMiddleware').isAdmin

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success',
  })
)

router.get('/authenticated', (req, res) => {
  // console.log('isAuthenticated :>> ', req.isAuthenticated());
  res.send(req.isAuthenticated())
})

router.post('/register', (req, res, next) => {
  const { password, username } = req.body
  if (password.length === 0 || username.length === 0) res.redirect('/register')

  const saltHash = genPassword(req.body.password)

  const salt = saltHash.salt
  const hash = saltHash.hash

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    favorites: {},
  })

  newUser.save().then(user => {
    console.log(user)
  })

  res.redirect('/login')
})

// TO-DO: Refactor to reduce code repetition
// Track any updates to favorites here
const favoritesCache = {}
router.post('/favorites', async (req, res) => {
  // Add favorites to our hashmap
  const { id, isFavorite } = req.body
  const { _id } = req.user

  // User ID is not in our mem cache, so add it there
  if (favoritesCache[_id] == null) {
    const { favorites } = await User.findById(_id)
    favoritesCache[_id] = favorites
  }

  // Add favorite to our hashmap
  favoritesCache[_id][id] = isFavorite

  // Update the User with new object
  User.findOneAndUpdate({ _id }, { favoritesCache })

  // Send status code so client knows succeeded
  res.sendStatus(200)
})

/**
 * -------------- GET ROUTES ----------------
 */

// Respond saying if something is a favorite
router.get('/favorites', async (req, res) => {
  const { _id } = req.user

  // User ID is not in our mem cache, so add it there
  if (favoritesCache[_id] == null) {
    const { favorites } = await User.findById(_id)
    favoritesCache[_id] = favorites
  }

  // Send back user favorites
  res.send(favoritesCache[_id])
})

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout()
  res.sendStatus(200)
})

router.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
})

/*
router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>')
})

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>'

  res.send(form)
})

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>'

  res.send(form)
})

router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route.')
})

router.get('/admin-route', isAdmin, (req, res, next) => {
  res.send('You made it to the admin route.')
})

router.get('/login-success', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  )
})

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.')
})
*/

module.exports = router
