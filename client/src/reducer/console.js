import { CONOSLE_APPEND, CONSOLE_CLEAR } from '../actions'

const initialState = {
  createSubscription: { data: [] },
  getSubscriptions: { data: [] },
  getSubscription: { data: [] },
  updateSubscription: { data: [] },
  removeSubscription: { data: [] },
} 

const consoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONOSLE_APPEND: {
      const nextData = [...state[action.name].data, action.data]
      return { ...state, [action.name]: { data: nextData } }
    }
    case CONSOLE_CLEAR: {
      const nextConfig = { [action.name]: { data: [] } }
      return { ...state, ...nextConfig }
    }
    default:
      return state
  }
}

export default consoleReducer

