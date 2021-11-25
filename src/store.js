import { createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rootReducer from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'rc-subscription-fiddler-root',
  whitelist: ['configuration'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const configureStore = (state = {}) => {
  const store = createStore(persistedReducer, state, composeEnhancers());
  persistStore(store)
  return store
}

export default configureStore