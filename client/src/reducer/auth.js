import update from 'immutability-helper'

import { AUTH_SET_LOGGED_IN, AUTH_SET_LOGIN_DETAILS, AUTH_SET_ACCESS_TOKEN } from '../actions'
 
const initialState = { isLoggedIn: false, loginDetails: { oauth: {}, password: {}}, type: '' }

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_LOGGED_IN:
      return update(state, { isLoggedIn: { $set: action.isLoggedIn } })
    case AUTH_SET_LOGIN_DETAILS:
      return update(state, { loginDetails: { $merge: {[action.source]: action.details} }, type: { $set: action.source } })
    case AUTH_SET_ACCESS_TOKEN:
      return update(state, { token: { $set: action.token } })
    default:
      return state
  }
}

export default auth
