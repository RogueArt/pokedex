import axios from 'axios'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import { useState, useEffect } from 'react'

import Home from './Home.js'
import Login from './Login.js'
import Register from './Register.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import LoadingIcon from './components/LoadingIcon.js'

// import Button from '@material-ui/core/Button'

import './styles/App.scss'

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isBusy, setBusy] = useState(true)

  // Check whether or not user is authenticated
  useEffect(() => {
    // Set if user is authenticated or not
    async function setAuthStatus() {
      const { data: authenticated } = await axios.get('/authenticated')
      setAuthenticated(authenticated)

      setBusy(false)
    }

    setAuthStatus()
  }, [])

  function loadContents() {
    // Show a spinner if we are trying to figure out if user is authenticated
    if (isBusy) return <LoadingIcon m="2rem" />

    return (
      <Router>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <ProtectedRoute
          exact
          path="/home"
          isAuthenticated={isAuthenticated}
          isBusy={isBusy}
          component={Home}
        />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Router>
    )
  }

  return <>{loadContents()}</>
}

export default App