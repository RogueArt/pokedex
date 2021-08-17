import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import axios from 'axios'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  function handleChange(e, type) {
    formData[type] = e.target.value
    setFormData({ ...formData })
  }

  function sendFormData() {
    axios
      .post('http://localhost:3001/users/login', formData)
      .catch(err => console.error('Could not reach server'))
  }

  return (
    <div>
      <FormControl>
        <InputLabel htmlFor="username">Email Address</InputLabel>
        <Input
          id="username"
          value={formData.username}
          onChange={e => handleChange(e, 'username')}
        ></Input>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          value={formData.password}
          onChange={e => handleChange(e, 'password')}
        ></Input>
      </FormControl>
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={sendFormData}
      >
        Sign In
      </Button>
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
