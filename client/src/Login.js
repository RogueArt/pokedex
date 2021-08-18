import React, { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'

// import Box from '@material-ui/core/Box'
// import FormControl from '@material-ui/core/FormControl'
// import InputLabel from '@material-ui/core/InputLabel'
// import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import * as EmailValidator from 'email-validator'

import axios from 'axios'
import { useHistory } from 'react-router-dom'

export default function Login() {
  const history = useHistory()
  const [invalidCreds, setInvalidCreds] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [fieldsAreEmpty, setEmptyFields] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  function checkFieldsEmpty() {
    // Everything must have a non-zero length
    return formData.username.length === 0 || formData.password.length === 0
  }

  // TO-DO: Move this utils.js
  async function redirectOnAuthTo(history, path) {
    // Get authenticated status, redirect to home
    const { data: authenticated } = await axios.get('/authenticated')

    // Redirect to /home
    if (authenticated) {
      window.location = '/home'
    }
    return authenticated
  }

  function handleChange(e, type) {
    formData[type] = e.target.value
    setFormData({ ...formData })
  }

  async function sendFormData() {
    // Validate email and set them in response
    const isEmailValid = EmailValidator.validate(formData.username)
    setInvalidEmail(isEmailValid)

    // Check all forms are filled
    const isEmpty = checkFieldsEmpty()
    setEmptyFields(isEmpty)

    if (!isEmailValid || isEmpty) return

    // Send a post request
    await axios
      .post('/login', formData)
      .catch(err => console.error('Could not reach server'))

    // See if user was authenticated
    const authenticated = await redirectOnAuthTo(history, '/home')

    // If authenticated, credentials were correct
    setInvalidCreds(!authenticated)
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
    <div className="login">
      <Grid
        className="login__card"
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
          <Grid item className="login__item">
            <Typography
              variant="h3"
              component="h1"
              onClick={focusInput}
              style={{ textAlign: 'center' }}
            >
              Login
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
          <Grid item className="login__item">
            <TextField
              variant="outlined"
              label="Email Address"
              type="email"
              value={formData.username}
              onChange={e => handleChange(e, 'username')}
              className="login__field"
              style={{ marginBottom: '16px' }}
              required
              ref={inputRef}
            ></TextField>
          </Grid>
          <Grid m={3} item className="login__item">
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => handleChange(e, 'password')}
              style={{ marginBottom: '16px' }}
              required
              className="login__field"
            ></TextField>
          </Grid>
          <Grid item className="login__item">
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                color: 'red',
              }}
              component="p"
              onClick={focusInput}
            >
              {invalidCreds ? 'Invalid password or email.' : ''}
            </Typography>
          </Grid>
          <ShowFieldsEmpty fieldsAreEmpty={fieldsAreEmpty} />
          <Grid item className="login__item">
            <Button
              color="primary"
              size="small"
              variant="contained"
              onClick={sendFormData}
              className="login__field"
              style={{ marginBottom: '16px' }}
            >
              Sign In
            </Button>
          </Grid>
          <Grid>
            <Typography variant="body1" color="textSecondary" component="p">
              Don't have an account? <Link href="/register">Sign up</Link>!
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
