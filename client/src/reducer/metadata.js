import update from 'immutability-helper'

import { SET_METADATA } from '../actions'

const initialState = { create: {}, update: {}, get: {}, cancel: {}, all: {} } 

const metadata = (state = initialState, action) => {
  switch (action.type) {
    case SET_METADATA: {
      return update(state, { [action.source]: { $merge: action.value } })
    }
    default:
      return state
  }
}

export default metadata

