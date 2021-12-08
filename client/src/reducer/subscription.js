import { SUBSCRIPTION_SAVE, SUBSCRIPTION_REMOVE, SUBSCRIPTION_CLEAR, SUBSCRIPTION_SET_METADATA } from '../actions'

const initialState = { application: {}, all: {}, individual: {}, metadata: {} }

const subscription = (state = initialState, action) => {
  const { source } = action
  switch (action.type) {
    case SUBSCRIPTION_SAVE: {
      const { process } = action
      const next = process === 'batch' ? {...state[source], ...action.data} : {...state[source], [action.data.id]: action.data}
      return {...state, [source]: next}
    }
    case SUBSCRIPTION_SET_METADATA: {
      const nextMetadata = {...state.metadata}
      nextMetadata[action.id] = Object.assign({}, nextMetadata[action.id], action.metadata)
      return {...state, metadata: nextMetadata}
    }
    case SUBSCRIPTION_REMOVE: {
      let next = {...state[source]}
      const nextMetadata = {...state.metadata}
      delete next[action.id]
      delete nextMetadata[action.id]
      if (source === 'individual') { next = {} }
      return {...state, [source]: next, metadata: nextMetadata}
    }
    case SUBSCRIPTION_CLEAR: {
      return {...state, ...{[source]: {}}}
    }
    default:
      return state
  }
}

export default subscription

