import { CONOSLE_APPEND, CONSOLE_CLEAR, SET_CONSOLE_ACTIVE_TAB, SET_CONSOLE_HEIGHT, SUBSCRIPTION_REMOVE, SUBSCRIPTION_CLEAR, CONSOLE_DELETE } from '../actions'

const initialState = {
  requestResponse: {data: []},
  general: {data: []},
  metadata: {height: 40, activeTab: 'general'}
} 

const whitelist = Object.keys(initialState)

const consoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONOSLE_APPEND: {
      const details = state[action.name] ? state[action.name] : {}
      const data = details.data ? [...details.data] : []
      const nextData = [...data, action.data]
      return { ...state, [action.name]: { data: nextData } }
    }
    case CONSOLE_CLEAR: {
      const nextConfig = { [action.name]: { data: [] } }
      return { ...state, ...nextConfig }
    }
    case SET_CONSOLE_ACTIVE_TAB: {
      const metadata = {...state.metadata, ...{activeTab: action.value}}
      return { ...state, metadata }
    }
    case SET_CONSOLE_HEIGHT: {
      const metadata = {...state.metadata, ...{height: action.value}}
      return { ...state, metadata }
    }
    case SUBSCRIPTION_REMOVE: 
    case CONSOLE_DELETE: {
      const nextState = {...state}
      delete nextState[action.id]
      const metadata = {...state.metadata}
      metadata.activeTab = nextState.hasOwnProperty(metadata.activeTab) ? metadata.activeTab : 'general'
      return {...nextState, ...{metadata}}
    }
    case SUBSCRIPTION_CLEAR: {
      if (action.source !== 'application') { return state }
      const nextState = {...state}
      Object.keys(nextState).forEach((key) => {
        if (whitelist.includes(key)) { return }
        delete nextState[key]
      })
      const metadata = {...state.metadata}
      metadata.activeTab = whitelist.includes(metadata.activeTab) ? metadata.activeTab : 'general'
      return {...nextState, ...{metadata}}
    }
    default:
      return state
  }
}

export default consoleReducer

