import { SET_METADATA } from '../actions'

const initialState = { create: {}, update: {}, get: {}, cancel: {}, all: {} } 

const metadata = (state = initialState, action) => {
  switch (action.type) {
    case SET_METADATA: {
      const newData = Object.assign({}, state[action.source], action.value)
      return { ...state, ...{[action.source]: newData} }
    }
    default:
      return state
  }
}

export default metadata

