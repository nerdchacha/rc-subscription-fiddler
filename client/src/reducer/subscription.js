import { SUBSCRIPTION_SAVE, SUBSCRIPTION_REMOVE } from '../actions'

const initialState = {} 

const subscription = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIPTION_SAVE: {
      return {...state, [action.data.id]: action.data}
    }
    case SUBSCRIPTION_REMOVE: {
      const newState = {...state}
      delete newState[action.id]
      return newState
    }
    default:
      return state
  }
}

export default subscription

