import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import consoleReducer from './console'
import configuration from './configuration'
import authReducer from './auth'
import globalReducer from './global'
import subscriptionReducer from './subscription'

const createRootReducer = (history) => combineReducers({
  auth: authReducer,
  console: consoleReducer,
  subscription: subscriptionReducer,
  global: globalReducer,
  router: connectRouter(history),
})

export default createRootReducer