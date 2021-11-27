import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import console from './console'
import configuration from './configuration'
import auth from './auth'

const createRootReducer = (history) => combineReducers({
  auth,
  console,
  configuration,
  router: connectRouter(history),
})

export default createRootReducer