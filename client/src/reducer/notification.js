import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from '../actions';

const defaultState = {
  data: [],
};

const notification = (state = defaultState, action) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {...state, data: [...state.data, {key: action.key, ...action.notification}]}
    case CLOSE_SNACKBAR:
      return {
        ...state,
        data: state.data.map(notification => (
          (action.dismissAll || notification.key === action.key) ? { ...notification, dismissed: true } : { ...notification }
        ))
      }
    case REMOVE_SNACKBAR:
      return {
        ...state,
        data: state.data.filter(notification => notification.key !== action.key)
      }
    default:
      return state;
  }
};
  
  export default notification
  