import { AUTH_SET_LOGGED_IN, AUTH_SET_LOGIN_DETAILS, AUTH_SET_ACCESS_TOKEN } from '../actions'
 
const initialState = { isLoggedIn: false, loginDetails: { '3LeggedLogin': {}, password: {}} }

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_LOGGED_IN: 
      return { ...state, isLoggedIn: action.isLoggedIn }
    case AUTH_SET_LOGIN_DETAILS:
      const details = Object.assign({}, state.loginDetails, {[action.source]: action.details})
      return { ...state, loginDetails: details }
    case AUTH_SET_ACCESS_TOKEN:
      return { ...state, token: action.token }
    default:
      return state
  }
}

export default auth

