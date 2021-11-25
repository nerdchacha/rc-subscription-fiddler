import { createStore } from 'redux';

import rootReducer from './reducer'

const initialState = { console: {data: ''} }

const configureStore = (state = initialState) => {
  return createStore(rootReducer, state, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

export default configureStore