import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import consoleReducer from './console'
import authReducer from './auth'
import globalReducer from './global'
import subscriptionReducer from './subscription'
import metadataReducer from './metadata'
import notificationReducer from './notification'

const subscriptionPersistConfig = {
  key: 'rc-subscription-fiddler-subscription',
  whitelist: ['application'],
  storage,
}

const createRootReducer = (history) => combineReducers({
  auth: authReducer,
  console: consoleReducer,
  subscription: persistReducer(subscriptionPersistConfig, subscriptionReducer),
  global: globalReducer,
  metadata: metadataReducer,
  notification: notificationReducer,
  router: connectRouter(history),
})

export default createRootReducer