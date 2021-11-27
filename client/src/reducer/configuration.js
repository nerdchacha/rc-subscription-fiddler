import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = { showModal: false, data: {} }

const configPersistConfig = {
  key: 'rc-subscription-fiddler-config',
  storage: storage,
}

const configuration = (state = initialState, action) => {
  switch (action.type) {
    case 'showModal': {
      return { ...state, showModal: action.showModal }
    }
    case 'setConfiguration': {
      return { ...state, data: action.data }
    }
    default:
      return state
      
  }
}

export default persistReducer(configPersistConfig, configuration)

