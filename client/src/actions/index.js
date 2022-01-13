import { push } from 'connected-react-router'

import * as ringcentral from '../ringcentral'
import { ROUTES, CONSOLE_HEIGHT } from '../constants'

export const CONOSLE_APPEND = 'CONSOLE_APPEND'
export const CONSOLE_CLEAR = 'CONSOLE_CLEAR'
export const AUTH_SET_LOGGED_IN = 'AUTH_SET_LOGGED_IN'
export const GLOBAL_SET_IS_LOADING = 'GLOBAL_SET_IS_LOADING'
export const AUTH_SET_LOGIN_DETAILS = 'AUTH_SET_LOGIN_DETAILS'
export const AUTH_SET_ACCESS_TOKEN = 'AUTH_SET_ACCESS_TOKEN'
export const CONSOLE_REQUEST_SET_DATA = 'CONSOLE_REQUEST_SET_DATA'
export const CONSOLE_RESPONSE_SET_DATA = 'CONSOLE_RESPONSE_SET_DATA'
export const SUBSCRIPTION_SAVE = 'SUBSCRIPTION_SAVE'
export const SUBSCRIPTION_REMOVE = 'SUBSCRIPTION_REMOVE'
export const SUBSCRIPTION_CLEAR = 'SUBSCRIPTION_CLEAR'
export const SUBSCRIPTION_SET_METADATA  = 'SUBSCRIPTION_SET_METADATA'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_CONSOLE_HEIGHT = 'SET_CONSOLE_HEIGHT'
export const SET_CONSOLE_ACTIVE_TAB = 'SET_CONSOLE_ACTIVE_TAB'
export const CONSOLE_DELETE = 'CONSOLE_DELETE'
export const SET_METADATA = 'SET_METADATA'
export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';
export const CONSOLE_FOLD_ALL = 'CONSOLE_FOLD_ALL'

export const appendToConsole = ({text, canCopy, type = 'text', name, collapsible = false, isCode = false }) => ({type: CONOSLE_APPEND, data: {text, canCopy, type, collapsible, isCode}, name})
export const clearConsole = (name) => ({type: CONSOLE_CLEAR, name})
export const setLoggedIn = (isLoggedIn) => ({type: AUTH_SET_LOGGED_IN, isLoggedIn})
export const globalSetIsLoading = (isLoading) => ({type: GLOBAL_SET_IS_LOADING, isLoading})
export const setLoginDetails = (details, source) => ({type: AUTH_SET_LOGIN_DETAILS, details, source})
export const setAccessToken = (token) => ({type: AUTH_SET_ACCESS_TOKEN, token})
export const consoleSetRequestData = (requestId, data) => ({type: CONSOLE_REQUEST_SET_DATA, data, requestId})
export const consoleSetResponseData = (requestId, data) => ({type: CONSOLE_RESPONSE_SET_DATA, data, requestId})
export const subscriptionSave = ({data, process, source = 'application'}) => ({type: SUBSCRIPTION_SAVE, data, process, source})
export const subscriptionRemove = ({id, source = 'application'}) => ({type: SUBSCRIPTION_REMOVE, id, source})
export const subscriptionClear = (source = 'application') => ({type: SUBSCRIPTION_CLEAR, source})
export const subscriptionSetMetadata = ({id, metadata}) => ({type: SUBSCRIPTION_SET_METADATA, id, metadata})
export const setConsoleActiveTab = (value) => ({type: SET_CONSOLE_ACTIVE_TAB, value})
export const setConsoleHeight = (value) => ({type: SET_CONSOLE_HEIGHT, value})
export const deleteConsole = (id) => ({type: CONSOLE_DELETE, id})
export const setMetadata = (source, value) => ({type: SET_METADATA, source, value})
export const consoleFoldAll = (name) => ({type: CONSOLE_FOLD_ALL, name, fold: true})
export const consoleUnfoldAll = (name) => ({type: CONSOLE_FOLD_ALL, name, fold: false})

export const login = (loginType) => async (dispatch, getState) => {
  const { auth: { loginDetails } } = getState()
  const details = loginType === 'password' ? loginDetails.password : loginDetails.oauth
  const { serverUrl, appKey, appSecret, username, password, extension } = details
  try {
    ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
    if (loginType === 'password') { dispatch(globalSetIsLoading(true, 'auth')) }
    const token = await ringcentral.login({type: loginType, username, password, extension})
    dispatch(setLoggedIn(true))
    dispatch(setAccessToken(token))
    dispatch(globalSetIsLoading(false))
    dispatch(push(ROUTES.CREATE_SUBSCRIPTION))
  } catch (e) {
    dispatch(notifier.error(`Error while logging in. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while logging in', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
    dispatch(setLoggedIn(false))
    dispatch(globalSetIsLoading(false))
    dispatch(setAccessToken({}))
  }
}

export const loginUsingAccessToken = () => async (dispatch, getState) => {
  const { auth: { loginDetails, isLoggedIn, token, type: loginType }, router: { location } } = getState()
  if (!isLoggedIn) { return }
  const { serverUrl, appKey, appSecret } = loginDetails[loginType]
  ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
  dispatch(globalSetIsLoading(true))
  dispatch(reregisterSubscriptionEvents())
  try {
    ringcentral.setToken(token)
    dispatch(setLoggedIn(true))
    dispatch(push(location.pathname))
  } catch (e) {
    dispatch(notifier.error(`Error while logging in. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while logging in', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
    dispatch(setLoggedIn(false))
    dispatch(setAccessToken({}))
  } finally {
    dispatch(globalSetIsLoading(false))
  }
}

export const logout = () => async (dispatch, getState) => {
  dispatch(globalSetIsLoading(true))
  dispatch(appendToConsole({text: 'Clearning all subscriptions created using this app', name: 'general'}))
  const { subscription: { application: generatedSubscriptions } } = getState()
  try {
    const removeAllSubscriptionsRequest = Object.keys(generatedSubscriptions).map((key) => {
      const subscription = ringcentral.subscriptions.createSubscription()
        subscription.setSubscription(generatedSubscriptions[key])
        return subscription.remove()
    })
    await Promise.all(removeAllSubscriptionsRequest)
  } catch (e) {
    dispatch(appendToConsole({text: 'Unable to clear all subscriptions. Some subscriptions might have become stale', type: 'info', name: 'general'}))
  }
  dispatch(subscriptionClear('application'))
  dispatch(subscriptionClear('all'))
  try {
    await ringcentral.logout()
  } catch (e) {
    dispatch(appendToConsole({text: 'Error while logging out', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
  dispatch(globalSetIsLoading(false))
  dispatch(setLoggedIn(false))
  dispatch(setAccessToken({}))
  dispatch(push(ROUTES.LOGIN))
}

export const createSubscription = ({eventFilters, transportType}) => async (dispatch) => {
  if (transportType === 'webhook') { return dispatch(notifier.error('Webhooks are not implemented yet')) }
  dispatch(setMetadata('create', {isLoading: true}))
  dispatch(appendToConsole({text: 'Attempting to create subscription', name: 'general'}))
  try {
    const subscription = await ringcentral.subscribe({eventFilters})
    const subscriptionData = subscription.subscription()
    dispatch(subscriptionSave({data: subscriptionData, source: 'application'}))
    dispatch(notifier.success('Subscription creates successfully'))
    dispatch(appendToConsole({text: `Subscription with id ${subscriptionData.id} successfully created`, type: 'success', name: 'general'}))
    dispatch(setConsoleActiveTab(subscriptionData.id))
    dispatch(setConsoleHeight(CONSOLE_HEIGHT))
    dispatch(appendToConsole({text: 'Subscription Details', name: subscriptionData.id}))
    dispatch(appendToConsole({text: JSON.stringify(subscriptionData, null, 2), canCopy: true, name: subscriptionData.id, collapsible: !!Object.keys(subscriptionData).length, isCode: true}))
    dispatch(appendToConsole({text: 'Listening for notifications', type: 'info', name: subscriptionData.id}))
  } catch (e)  {
    dispatch(notifier.error(`Unable to create subscription. ${e.message}`))
    dispatch(appendToConsole({text: 'Unable to create subscription', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
  dispatch(setMetadata('create', {isLoading: false}))
}

export const getSubscriptions = () => async (dispatch) => {
  dispatch(setMetadata('all', {isLoading: true}))
  const platform = ringcentral.platform
  try {
    dispatch(appendToConsole({text: 'Fetching all subscriptions', name: 'general'}))
    const response = await platform.get('/restapi/v1.0/subscription')
    const json = await response.json()
    dispatch(appendToConsole({text: 'Succesfully fetched all subscriptions', type: 'success', name: 'general'}))
    dispatch(subscriptionClear('all'))
    const allsubscriptions = json.records.reduce((seed, subscription) => {
      seed[subscription.id] = subscription
      return seed
    }, {})
    dispatch(subscriptionSave({data: allsubscriptions, source: 'all', process: 'batch'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to get all subscriptions. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while fetching all subscriptions', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
  dispatch(setMetadata('all', {isLoading: false}))
}

export const getSubscription = (subscriptionId) => async (dispatch) => {
  dispatch(setMetadata('get', {isLoading: true}))
  const platform = ringcentral.platform
  try {
    dispatch(appendToConsole({text: `Fetching subscription ${subscriptionId}`, name: 'general'}))
    const response = await platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    const json = await response.json()
    dispatch(appendToConsole({text: 'Succesfully fetched subscription', type: 'success', name: 'general'}))
    dispatch(subscriptionSave({data: json, source: 'individual', process: 'batch'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to get subscription. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while fetching subscription', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
  dispatch(setMetadata('get', {isLoading: false}))
}

export const updateSubscription = ({subscriptionId, eventFilters}) => async (dispatch, getState) => {
  dispatch(setMetadata('update', {isLoading: true}))
  dispatch(appendToConsole({text: `Updating subscription ${subscriptionId}`, name: 'general'}))
  const { subscription: { application: generatedSubscriptions } } = getState()
  let subscriptionData = generatedSubscriptions[subscriptionId]
  try {
    if (!subscriptionData) {
      dispatch(appendToConsole({text: 'Seems like the subscription was either not created using this application or we do not have the data for this anymore', type: 'info', name: 'general'}))
      dispatch(appendToConsole({text: `Fetching subscription details for id ${subscriptionId}`, name: 'general'}))
      const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
      subscriptionData = await response.json()
    }
  } catch (e) {
    dispatch(notifier.error(`Unable to fetch subscription details. ${e.message}`))
    dispatch(appendToConsole({text: `Unable to fetch subscriptind details for id ${subscriptionId} to update it`, type: 'error', name: 'general'}))
    dispatch(setMetadata('update', {isLoading: false}))
    return
  }
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  dispatch(appendToConsole({text: `Updating subscription with id ${subscriptionId}`, name: 'general'}))
   try {  
    await subscription.setEventFilters(eventFilters).register();
    const updatedSubscriptionData = Object.assign(subscriptionData, {eventFilters})
    ringcentral.registerSubscriptionEvents(subscription)
    dispatch(setConsoleActiveTab(subscriptionData.id))
    dispatch(setConsoleHeight(CONSOLE_HEIGHT))
    dispatch(subscriptionSave({data: updatedSubscriptionData, source: 'application'}))
    dispatch(notifier.success('Subscription updates successfully'))
    dispatch(appendToConsole({text: `Successfully updated subscription with id ${subscriptionId}`, name: 'general', type: 'success'}))
    dispatch(appendToConsole({text: 'Subscription details', name: subscriptionId}))
    dispatch(appendToConsole({text: JSON.stringify(updatedSubscriptionData, null, 2), canCopy: true, name: subscriptionId, isCode: true, collapsible: !!Object.keys(updatedSubscriptionData).length}))
    dispatch(appendToConsole({text: 'Listening for notifications', type: 'info', name: subscriptionData.id}))
   } catch (e) {
    dispatch(notifier.error(`Unable to update subscription. ${e.message}`))
    dispatch(appendToConsole({text: `Unable to update subscription with id ${subscriptionId}`, type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
   }
   dispatch(setMetadata('update', {isLoading: false}))
}

export const cancelSubscription = (subscriptionId) => async (dispatch, getState) => {
  dispatch(setMetadata('cancel', {isLoading: true}))
  const { subscription: { application: generatedSubscriptions } } = getState()
  let subscriptionData = generatedSubscriptions[subscriptionId]
  if (!subscriptionData) {
    dispatch(appendToConsole({text: 'Seems like the subscription was either not created using this application or we do not have the data for this anymore', type: 'info', name: 'general'}))
    dispatch(appendToConsole({text: `Fetching subscription details for id ${subscriptionId}`, name: 'general'}))
    try {
      const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
      subscriptionData = await response.json()
      dispatch(appendToConsole({text: `Successfully fetched subscription details for id ${subscriptionId}`, type: 'success', name: 'general'}))
    } catch (e) {
      dispatch(notifier.error(`Unable to fetch subscription details. ${e.message}`))
      dispatch(appendToConsole({text: `Unable to fetch subscriptind details for id ${subscriptionId} to remove it`, type: 'error', name: 'general'}))
      dispatch(setMetadata('cancel', {isLoading: false}))
      return
    }
  }
  dispatch(appendToConsole({text: `Removing subscription with id ${subscriptionId}`, name: 'general'}))
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  try {
    await subscription.remove()
    dispatch(notifier.success('Subscription removed successfully'))
    dispatch(appendToConsole({text: `Successfully removed subscription with id ${subscriptionId}`, name: 'general', type: 'success'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to cancel subscription. ${e.message}`))
    dispatch(appendToConsole({text: `Unable to cancel subscription with id ${subscriptionId}`, type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
  dispatch(subscriptionRemove({id: subscriptionId, source: 'application'}))
  dispatch(subscriptionRemove({id: subscriptionId, source: 'all'}))
  dispatch(subscriptionRemove({id: subscriptionId, source: 'individual'}))
  dispatch(setMetadata('cancel', {isLoading: false}))
}

export const reregisterSubscriptionEvents = () => async (dispatch, getState) => {
  const { subscription: { application: generatedSubscriptions } } = getState()
  try {
    Object.keys(generatedSubscriptions).forEach((key) => {
      const subscription = ringcentral.subscriptions.createSubscription()
      subscription.setSubscription(generatedSubscriptions[key])
      ringcentral.registerSubscriptionEvents(subscription)
    })
  } catch (e) {
    dispatch(appendToConsole({text: 'Unable to reregister all subscription on page reload', type: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, type: 'error', name: 'general'}))
  }
}


export const reopenConsoleTab = (id) => (dispatch, getState) => {
  const { console: consoleData } = getState()
  // User manually closed the tab. Recreate it
  if (!consoleData[id]) {
    dispatch(appendToConsole({text: 'Listening for notifications', type: 'info', name: id}))
  }
  dispatch(setConsoleActiveTab(id))
  dispatch(setConsoleHeight(CONSOLE_HEIGHT))
}

const platformEventListener = (dispatch) => ({source, event, data, type}) => {
  dispatch(appendToConsole({text: `Received Platform event ${event}`, type, name: 'general'}))
  dispatch(appendToConsole({text: 'Event Data', name: 'general'}))
  dispatch(appendToConsole({text: data ? JSON.stringify(data, null, 2) : '', canCopy: true, name: 'general', isCode: true, collapsible: !!Object.keys(data).length}))
}

const subscriptionEventListener = (dispatch) => ({source: subscription, event, data, type, subscriptionId}) => {
  dispatch(appendToConsole({text: `Received Subscription event ${event}`, type, name: subscriptionId}))
  dispatch(appendToConsole({text: 'Event Data', name: subscriptionId}))
  dispatch(appendToConsole({text: data ? JSON.stringify(data, null, 2) : '', canCopy: true, name: subscriptionId, isCode: true, collapsible: !!Object.keys(data).length}))
  if (event === subscription.events.renewError) {
    dispatch(appendToConsole({text: `Subscription with id ${subscriptionId} failed to renew`, type: 'info', name: 'general'}))
    dispatch(appendToConsole({text: `Removing its data from the application`, type: 'info', name: 'general'}))
    dispatch(subscriptionRemove({id: subscriptionId}))
  }
  if (event === subscription.events.renewSuccess) {
    dispatch(subscriptionSave({data: subscription.subscription(), source: 'application'}))
  }
}

export const enqueueSnackbar = (notification) => {
  const key = notification.options && notification.options.key;
  return { type: ENQUEUE_SNACKBAR, notification: {...notification, key: key || new Date().getTime() + Math.random()}}
}

export const closeSnackbar = key => ({type: CLOSE_SNACKBAR, dismissAll: !key, key})

export const removeSnackbar = key => ({ type: REMOVE_SNACKBAR, key})

export const notifier = {
  success: (message) => enqueueSnackbar({message, options: {variant: 'success'}}),
  error: (message) => enqueueSnackbar({message, options: {variant: 'error'}}),
  info: (message) => enqueueSnackbar({message, options: {variant: 'info'}}),
  warn: (message) => enqueueSnackbar({message, options: {variant: 'warn'}}),
}