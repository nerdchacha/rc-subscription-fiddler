const initialState = { isLoggedIn: false }

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'setLoggedIn': 
    return { isLoggedIn: action.isLoggedIn }
    default:
      return state
  }
}

export default auth

