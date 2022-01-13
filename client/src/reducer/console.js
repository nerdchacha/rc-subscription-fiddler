import { CONOSLE_APPEND, CONSOLE_CLEAR, SET_CONSOLE_ACTIVE_TAB, SET_CONSOLE_HEIGHT, SUBSCRIPTION_REMOVE, SUBSCRIPTION_CLEAR, CONSOLE_DELETE, CONSOLE_FOLD_ALL, CONSOLE_REQUEST_SET_DATA, CONSOLE_RESPONSE_SET_DATA } from '../actions'

const initialState = {
  requestResponse: {data: {}},
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
      const nextConfig = { [action.name]: { data: action.name === 'requestResponse' ? {} : [] } }
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
    case CONSOLE_REQUEST_SET_DATA: {
      const data = {[action.requestId]: {request: Object.assign({}, action.data, {fold: true})}}
      const nextData = {...state.requestResponse.data, ...data}
      return { ...state, requestResponse: {data: nextData} }
    }
    case CONSOLE_RESPONSE_SET_DATA: {
      const data = Object.assign({}, state.requestResponse.data[action.requestId]);
      data.response = Object.assign({}, action.data, {fold: true})
      return { ...state, requestResponse: {data: {...state.requestResponse.data, ...{[action.requestId]: data} }}}
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
    case CONSOLE_FOLD_ALL: {
      const {name, fold} = action
      if (name === 'requestResponse') {
        const requestResponseData = Object.keys(state.requestResponse.data).reduce((seed, requestId) => {
          const nextData = {request: Object.assign({}, state.requestResponse.data[requestId].request, {fold}), response: Object.assign({}, state.requestResponse.data[requestId].response, {fold})}
          seed[requestId] = nextData
          return seed
        }, {})
        return {...state, requestResponse: {data: requestResponseData}}
      }
      const data = state[name] ? state[name].data : [];
      const nextData = data.map((item) => {
        if (!item.collapsible) { return item }
        return {...item, fold}
      })
      return { ...state, [name]: { data: nextData } }
    }
    default:
      return state
  }
}

export default consoleReducer

