const initialState = { data: '' } 

const console = (state = initialState, action) => {
  switch (action.type) {
    case 'append': {
      const data = state.data
      const nextData = `${data}--rc-newline--${action.data}`
      return { data: nextData }
    }
    case 'clear': {
      return { data: '' }
    }
    default:
      return initialState
      
  }
}

export default console

