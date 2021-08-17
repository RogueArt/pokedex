import axios from 'axios'

import { BrowserRouter as Router, Route, Redirect, useHistory } from 'react-router-dom'

import { useState, useEffect, useLayoutEffect } from 'react'

import Home from './Home.js'
import Login from './Login.js'
import Register from './Register.js'
import Landing from './Landing.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import LoadingIcon from './components/LoadingIcon.js'

// import Button from '@material-ui/core/Button'

import './styles/App.scss'

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isBusy, setBusy] = useState(true)
  const history = useHistory()
  console.log(history)

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

//  render={() => <Redirect to="/home" />}

export default App

/*
            <Button
        color="primary"
        size="small"
        variant="contained"
        value={isAuthenticated}
      >
        Authentication Status: {isAuthenticated ? 'Yes' : 'No'}
      </Button>

<div>
<nav className="navbar">
  <ul className="navbar__list">
    <li>
      <Link className="navbar__link" to="/home">
        Home
      </Link>
    </li>
    <li>
      <Link className="navbar__link" to="/login">
        Login
      </Link>
    </li>
    <li>
      <Link className="navbar__link" to="/register">
        Register
      </Link>
    </li>
  </ul>
</nav> 
      
*/

/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. 
<Switch>
*/

/* </Switch> 
</div> */
