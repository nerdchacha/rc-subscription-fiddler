import { SUBSCRIPTION_SAVE, SUBSCRIPTION_REMOVE, SUBSCRIPTION_CLEAR } from '../actions'

const initialState = { generated: {}, all: {} }

const subscription = (state = initialState, action) => {
  const { name } = action
  switch (action.type) {
    case SUBSCRIPTION_SAVE: {
      const { method } = action
      const next = method === 'batch' ? {...state[name], ...action.data} : {...state[name], [action.data.id]: action.data}
      return {...state, [name]: next}
    }
    case SUBSCRIPTION_REMOVE: {
      const next = {...state[name]}
      delete next[action.id]
      return {...state, [name]: next}
    }
    case SUBSCRIPTION_CLEAR: {
      return {...state, ...{[name]: {}}}
    }
    default:
      return state
  }
}

export default subscription

