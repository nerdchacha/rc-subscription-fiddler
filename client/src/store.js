import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'

import createRootReducer from './reducer'

export const history = createBrowserHistory()

const enhancers = []
const middleware = [thunk, routerMiddleware(history)]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const persistConfig = {
  key: 'rc-subscription-fiddler-root',
  whitelist: ['auth', 'console'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

const configureStore = (state = {}) => {
  const store = createStore(persistedReducer, state, composedEnhancers);
  const persistor = persistStore(store)
  return { store, persistor }
}

export default configureStore