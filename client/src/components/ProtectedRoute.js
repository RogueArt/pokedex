import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  console.log('Protected isAuthenticated :>> ', isAuthenticated)
  return (
    <Route
      {...rest}
      render={props => {
        // If authenticated, show them the app
        if (isAuthenticated) return <Component {...rest} {...props} />

        // If not authenticated, redirect them to login
        return <Redirect to="/login" />
      }}
    />
  )
}

export default ProtectedRoute
