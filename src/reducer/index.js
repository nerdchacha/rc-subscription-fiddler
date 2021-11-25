import { combineReducers } from 'redux'
import console from './console'
import configuration from './configuration'

const rootReducer = combineReducers({
  console,
  configuration
})

export default rootReducer