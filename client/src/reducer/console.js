import update from 'immutability-helper'

import { CONOSLE_APPEND, CONSOLE_CLEAR, SET_CONSOLE_ACTIVE_TAB, SET_CONSOLE_HEIGHT, SUBSCRIPTION_REMOVE, CONSOLE_DELETE, CONSOLE_FOLD_ALL } from '../actions'

const ALL_CONSOLE_MAX_CAPACITY = 400
const CONSOLE_REQUEST_RESPONSE_MAX_CAPACITY = 300

const initialState = {
  requestResponse: {data: []},
  general: {data: []},
  metadata: {height: 40, activeTab: 'general'}
} 

const consoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONOSLE_APPEND: {
      let nextState = state
      const currentData = state[action.name] ? state[action.name].data : []
      if (
        (currentData.length > CONSOLE_REQUEST_RESPONSE_MAX_CAPACITY && action.name === 'requestResponse') ||
        (currentData.length > ALL_CONSOLE_MAX_CAPACITY && action.name !== 'requestResponse')
      ) {
        nextState = update(state, { [action.name]: {$apply: (details) => {
          return {data: details.data.slice(1)}
        }}})
      }
      return update(nextState, { [action.name]: { $apply: (details) => {
        details = details || {data: []}
        return update(details, {data: {$push: [action.data]}})
      }}})
    }
    case CONSOLE_CLEAR: {
      return update(state, {[action.name]: {$set: {data: []}}})
    }
    case SET_CONSOLE_ACTIVE_TAB: {
      return update(state, {metadata: {activeTab: {$set: action.value}}})
    }
    case SET_CONSOLE_HEIGHT: {
      return update(state, {metadata: {height: {$set: action.value}}})
    }
    case SUBSCRIPTION_REMOVE: 
    case CONSOLE_DELETE: {
      const nextState = update(state, {$unset: [action.id]})
      return update(nextState, {metadata: {activeTab: {$set: nextState.hasOwnProperty(state.metadata.activeTab) ? state.metadata.activeTab : 'general'}}})
    }
    case CONSOLE_FOLD_ALL: {
      const {name, fold} = action
      return update(state, {[name]: {$apply: (details) => {
        if (!details) {return {data: []}}
        const data = details.data.map((item) => {
          if (!item.collapsible) { return item }
          return {...item, fold}
        })
        return { data }
      }}})
    }
    default:
      return state
  }
}

export default consoleReducer

