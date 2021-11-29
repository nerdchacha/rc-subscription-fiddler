import { CONOSLE_APPEND, CONSOLE_CLEAR } from '../actions'

const initialState = { data: [] } 

const console = (state = initialState, action) => {
  switch (action.type) {
    case CONOSLE_APPEND: {
      return { data: [...state.data, action.data] }
    }
    case CONSOLE_CLEAR: {
      return { data: [] }
    }
    default:
      return state
  }
}

export default console

