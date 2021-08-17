import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import LoadingIcon from './LoadingIcon.js'

const ProtectedRoute = ({ component: Component, isAuthenticated, isBusy, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isBusy) return <LoadingIcon m="2rem" />

        // If authenticated, show them the app
        if (isAuthenticated) return <Component {...rest} {...props} />

        // If not authenticated, redirect them to login
        return <Redirect to="/login" />
      }}
    />
  )
}

export default ProtectedRoute
