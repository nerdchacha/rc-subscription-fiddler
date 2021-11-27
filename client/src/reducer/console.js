const initialState = { data: [] } 

const console = (state = initialState, action) => {
  switch (action.type) {
    case 'append': {
      return { data: [...state.data, action.data] }
    }
    case 'clear': {
      return { data: [] }
    }
    default:
      return state
  }
}

export default console

