import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import consoleReducer from './console'
import configuration from './configuration'
import authReducer from './auth'
import globalReducer from './global'

const createRootReducer = (history) => combineReducers({
  auth: authReducer,
  console: consoleReducer,
  // configuration,
  global: globalReducer,
  router: connectRouter(history),
})

export default createRootReducer