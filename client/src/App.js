import axios from 'axios'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { useState, useEffect } from 'react'

import Home from './Home.js'
import Login from './Login.js'
import Register from './Register.js'
import Landing from './Landing.js'
import ProtectedRoute from './components/ProtectedRoute.js'

import './App.scss'

function App() {
  const [isAuthenticated, setAuthenticated] = useState(true)

  function handleLogin() {
    setAuthenticated(true)
  }

  function handleLogout() {
    setAuthenticated(false)
  }

  return (
    <Router>
      {/* <div>
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
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/" component={Landing} />
          <ProtectedRoute isAuthenticated={isAuthenticated} component={Home} exact path="/home" />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      {/* </div> */}
    </Router>
  )
}

export default App