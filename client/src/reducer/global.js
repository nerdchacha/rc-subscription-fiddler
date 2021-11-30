import { GLOBAL_SET_IS_LOADING, GLOBAL_REQUEST_RESPONSE_SET_DATA } from '../actions'

const initialState = { isLoading: false, requestResponse: [] } 

const global = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case GLOBAL_REQUEST_RESPONSE_SET_DATA: 
    return { ...state, requestResponse: [...state.requestResponse, action.data] }
    default:
      return state
  }
}

export default global

