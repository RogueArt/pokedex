import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
// import Form from '@material-ui/core/Form'

import axios from 'axios'
import { useHistory } from 'react-router-dom'

// TO-DO: Move this utils.js
async function redirectOnAuthTo(history, path) {
  // Get authenticated status, redirect to home
  const { data: authenticated } = await axios.get('/authenticated')
  if (authenticated) history.push(path)
}


const useStyle = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      margin: theme.spacing(2)
    }
  }
}))

export default function Login() {
  const history = useHistory()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const classes = useStyle()

  function handleChange(e, type) {
    formData[type] = e.target.value
    setFormData({ ...formData })
  }

  async function sendFormData() {
    // Send a post request
    await axios
      .post('/login', formData)
      .catch(err => console.error('Could not reach server'))

    await redirectOnAuthTo(history, '/home')
  }

  useEffect(() => {
    redirectOnAuthTo(history, '/home')
  }, [])

  return (
    <div className="login">
      <Grid className="login__card" container direction="column" justifyContent="center" alignItems="center">
        <Grid item className="login__item">
          <TextField
            variant="outlined"
            label="Email Address"
            type="email"
            value={formData.username}
            onChange={e => handleChange(e, 'username')}
            required
          ></TextField>
        </Grid>
        <Grid m={3} item className="login__item">
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            value={formData.password}
            onChange={e => handleChange(e, 'password')}
            required
          ></TextField>
        </Grid>
        <Grid item className="login__item">
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={sendFormData}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

/*
      <TextField
        label="Email Address"
        value={formData.username}
        onChange={e => handleChange(e, 'username')}
      ></TextField>
      */
