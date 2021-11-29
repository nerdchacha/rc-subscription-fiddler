import { GLOBAL_SET_IS_LOADING } from '../actions'

const initialState = { isLoading: false } 

const global = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    default:
      return state
  }
}

export default global

