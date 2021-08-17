import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import axios from 'axios'

axios.defaults.port = 3001

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    reenterPassword: '',
  })

  function handleChange(e, type) {
    formData[type] = e.target.value
    setFormData({ ...formData })
  }

  function sendFormData() {
    const { username, password } = formData
    axios
      .post('/register', { username, password })
      .then(res => console.log(res))
      .catch(err => console.error('Could not reach server'))
  }

  return (
    <div>
      <FormControl>
        <InputLabel htmlFor="username">Email Address</InputLabel>
        <Input
          id="username"
          type="email"
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
      <FormControl>
        <InputLabel htmlFor="reenter-password">Re-Enter Password</InputLabel>
        <Input
          id="reenter-password"
          value={formData.reenterPassword}
          onChange={e => handleChange(e, 'reenterPassword')}
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
