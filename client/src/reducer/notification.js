import update from 'immutability-helper'

import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from '../actions';

const defaultState = {
  data: [],
};

const notification = (state = defaultState, action) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return update(state, { data: { $push: [{ key: action.key, ...action.notification }] } })
    case CLOSE_SNACKBAR:
      return update(state, { data: { $apply: (data) => data.map(notification => (
        (action.dismissAll || notification.key === action.key) ? { ...notification, dismissed: true } : { ...notification }
      ))}})
    case REMOVE_SNACKBAR:
      return update(state, { data: { $apply: (data) => data.filter(notification => notification.key !== action.key) } })
    default:
      return state;
  }
};
  
  export default notification
  