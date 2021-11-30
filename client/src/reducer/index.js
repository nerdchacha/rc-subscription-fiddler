import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import console from './console'
import configuration from './configuration'
import auth from './auth'
import global from './global'

const createRootReducer = (history) => combineReducers({
  auth,
  console,
  configuration,
  global,
  router: connectRouter(history),
})

export default createRootReducer