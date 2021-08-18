import React, { useEffect, useState, useRef } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import axios from 'axios'
import { useHistory } from 'react-router-dom'
import * as EmailValidator from 'email-validator'

// TO-DO: Move this utils.js
async function redirectOnAuthTo(history, path) {
  // Get authenticated status, redirect to home
  const { data: authenticated } = await axios.get('/authenticated')

  // TO-DO: Remove hack to fix nasty redirect bug
  history.push('/register')

  // Redirect to /home
  if (authenticated) history.push(path)
}

export default function Register() {
  const history = useHistory()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    reenterPassword: '',
  })
  const [samePasswords, setSamePasswords] = useState(true)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [fieldsAreEmpty, setEmptyFields] = useState(false)

  function handleChange(e, type) {
    formData[type] = e.target.value
    setFormData({ ...formData })
  }

  function arePasswordsSame() {
    return formData.password === formData.reenterPassword
  }

  function checkFieldsEmpty() {
    // Everything must have a non-zero length
    return (
      formData.username.length === 0 ||
      formData.password.length === 0 ||
      formData.reenterPassword.length === 0
    )
  }

  async function sendFormData() {
    // Check if there are any empty fields
    const fieldsEmpty = checkFieldsEmpty()
    setEmptyFields(fieldsEmpty)

    // Validate email and set them in response
    const isEmailValid = EmailValidator.validate(formData.username)
    setInvalidEmail(!isEmailValid)
    
    // Make sure passwords match before sending
    const arePassesSame = arePasswordsSame()
    setSamePasswords(arePassesSame)

    // Don't make an account if it fails these checks
    if (fieldsEmpty || !arePassesSame || !isEmailValid) return

    const { username, password } = formData
    // Send a post request
    await axios
      .post('/register', { username, password })
      .catch(err => console.error('Could not reach server'))

    history.push('/login')
  }

  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  function focusInput() {
    inputRef.current.focus()
  }

  useEffect(() => {
    redirectOnAuthTo(history, '/home')
  }, [])

  return (
    <div className="register">
      <Grid
        className="register__card"
        container
        spacing={0}
        direction="column"
        justifyContent="center"
        alignItems="center"
        boxShadow={1}
        style={{ minHeight: '100vh' }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{
            width: 'max-content',
            height: 'auto',
            backgroundColor: 'white',
            padding: 'min(24px, 10vh) min(92px, 10vw)',
            borderRadius: '8px',
          }}
        >
          <Grid item className="register__item">
            <Typography
              variant="h3"
              component="h1"
              onClick={focusInput}
              style={{ textAlign: 'center' }}
            >
              Register
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              style={{ textAlign: 'center', marginBottom: '16px' }}
              component="p"
              onClick={focusInput}
            >
              Enter email and password
            </Typography>
          </Grid>
          <Grid item className="register__item">
            <TextField
              error={invalidEmail ? 'error' : false}
              helperText={invalidEmail ? 'Email is not valid' : ''}
              variant="outlined"
              label="Email Address"
              type="email"
              value={formData.username}
              onChange={e => handleChange(e, 'username')}
              className="register__field"
              style={{ marginBottom: '16px' }}
              required
              ref={inputRef}
            ></TextField>
          </Grid>
          <Grid item className="register__item">
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => handleChange(e, 'password')}
              style={{ marginBottom: '16px' }}
              required
              className="register__field"
            ></TextField>
          </Grid>
          <Grid item className="register__item">
            <TextField
              error={!samePasswords ? 'error' : false}
              helperText={!samePasswords ? 'Passwords do not match.' : ''}
              variant="outlined"
              label="Re-Enter Password"
              type="password"
              value={formData.reenterPassword}
              onChange={e => handleChange(e, 'reenterPassword')}
              style={{ marginBottom: '16px' }}
              required
              className="register__field"
            ></TextField>
          </Grid>
          <ShowFieldsEmpty fieldsAreEmpty={fieldsAreEmpty} />
          <Grid item className="register__item">
            <Button
              color="primary"
              size="small"
              variant="contained"
              onClick={sendFormData}
              className="register__field"
              style={{ marginBottom: '16px' }}
            >
              Sign Up
            </Button>
          </Grid>
          <Grid>
            <Typography variant="body1" color="textSecondary" component="p">
              Already have an account? <Link href="/login">Log in</Link>!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

function ShowFieldsEmpty({ fieldsAreEmpty }) {
  if (!fieldsAreEmpty) return <></>
  
  return (
    <Typography
      error={!fieldsAreEmpty ? 'error' : false}
      helperText={!fieldsAreEmpty ? 'Fill out all the fields.' : ''}
      variant="body2"
      color="error"
      style={{ textAlign: 'center', marginBottom: '16px' }}
      component="p"
    >
      You must fill out all the fields.
    </Typography>
  )
}

/*
      <TextField
        label="Email Address"
        value={formData.username}
        onChange={e => handleChange(e, 'username')}
      ></TextField>
      */
