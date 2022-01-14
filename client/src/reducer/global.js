import update from 'immutability-helper'

import { GLOBAL_SET_IS_LOADING } from '../actions'

const initialState = { isLoading: false, requestResponse: {} } 

const global = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_SET_IS_LOADING: {
      return update(state, { isLoading: { $set: action.isLoading } })
    }
    default:
      return state
  }
}

export default global

