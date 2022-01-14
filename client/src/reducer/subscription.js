import update from 'immutability-helper'

import { SUBSCRIPTION_SAVE, SUBSCRIPTION_REMOVE, SUBSCRIPTION_CLEAR, SUBSCRIPTION_SET_METADATA } from '../actions'

const initialState = { application: {}, all: {}, individual: {}, metadata: {} }

const subscription = (state = initialState, action) => {
  const { source } = action
  switch (action.type) {
    case SUBSCRIPTION_SAVE: {
      if (source === 'individual') { return update(state, { [source]: { $set: action.data } }) }
      return update(state, { [source]: { $merge: action.data } })
    }
    case SUBSCRIPTION_SET_METADATA: {
      return update(state, { metadata: { [action.id]: { $apply: (m) => m ? update(m, {$merge: action.metadata}) : action.metadata } } })
    }
    case SUBSCRIPTION_REMOVE: {
      return update(state, {[source]: {$unset: [action.id]}, metadata: {$unset: [action.id]}})
    }
    case SUBSCRIPTION_CLEAR: {
      return {...state, ...{[source]: {}}}
    }
    default:
      return state
  }
}

export default subscription

