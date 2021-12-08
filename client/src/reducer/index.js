import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import consoleReducer from './console'
import configuration from './configuration'
import authReducer from './auth'
import globalReducer from './global'
import subscriptionReducer from './subscription'

const subscriptionPersistConfig = {
  key: 'rc-subscription-fiddler-subscription',
  whitelist: ['generated'],
  storage,
}

const createRootReducer = (history) => combineReducers({
  auth: authReducer,
  console: consoleReducer,
  subscription: persistReducer(subscriptionPersistConfig, subscriptionReducer),
  global: globalReducer,
  router: connectRouter(history),
})

export default createRootReducer