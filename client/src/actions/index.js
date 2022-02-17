import { push } from 'connected-react-router'

import * as ringcentral from '../ringcentral'
import { ROUTES, CONSOLE_HEIGHT } from '../constants'

export const CONOSLE_APPEND = 'CONSOLE_APPEND'
export const CONSOLE_CLEAR = 'CONSOLE_CLEAR'
export const AUTH_SET_LOGGED_IN = 'AUTH_SET_LOGGED_IN'
export const GLOBAL_SET_IS_LOADING = 'GLOBAL_SET_IS_LOADING'
export const AUTH_SET_LOGIN_DETAILS = 'AUTH_SET_LOGIN_DETAILS'
export const AUTH_SET_ACCESS_TOKEN = 'AUTH_SET_ACCESS_TOKEN'
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

export const appendToConsole = ({name, text, summary, type = 'text', className = 'primary', canCopy = false, collapsible = false, isCode = false, fold = false, contentToCopy }) => 
({type: CONOSLE_APPEND, data: {text, summary, type, className, canCopy, collapsible, isCode, fold, contentToCopy}, name})
export const clearConsole = (name) => ({type: CONSOLE_CLEAR, name})
export const setLoggedIn = (isLoggedIn) => ({type: AUTH_SET_LOGGED_IN, isLoggedIn})
export const globalSetIsLoading = (isLoading) => ({type: GLOBAL_SET_IS_LOADING, isLoading})
export const setLoginDetails = (details, source) => ({type: AUTH_SET_LOGIN_DETAILS, details, source})
export const setAccessToken = (token) => ({type: AUTH_SET_ACCESS_TOKEN, token})
export const subscriptionSave = ({data, source}) => ({type: SUBSCRIPTION_SAVE, data, source})
export const subscriptionRemove = ({id, source}) => ({type: SUBSCRIPTION_REMOVE, id, source})
export const subscriptionClear = (source) => ({type: SUBSCRIPTION_CLEAR, source})
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
  const { serverUrl, clientId, clientSecret, username, password, extension } = details
  try {
    ringcentral.setup({serverUrl, clientId, clientSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
    if (loginType === 'password') { dispatch(globalSetIsLoading(true, 'auth')) }
    const token = await ringcentral.login({type: loginType, username, password, extension})
    dispatch(setLoggedIn(true))
    dispatch(setAccessToken(token))
    dispatch(globalSetIsLoading(false))
    dispatch(push(ROUTES.CREATE_SUBSCRIPTION))
  } catch (e) {
    dispatch(notifier.error(`Error while logging in. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while logging in', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
    dispatch(setLoggedIn(false))
    dispatch(globalSetIsLoading(false))
    dispatch(setAccessToken({}))
  }
}

export const loginUsingAccessToken = () => async (dispatch, getState) => {
  const { auth: { loginDetails, isLoggedIn, token, type: loginType }, router: { location } } = getState()
  if (!isLoggedIn) { return }
  const { serverUrl, clientId, clientSecret } = loginDetails[loginType]
  ringcentral.setup({serverUrl, clientId, clientSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
  dispatch(globalSetIsLoading(true))
  dispatch(reregisterSubscriptionEvents())
  try {
    await ringcentral.setToken(token)
    dispatch(setLoggedIn(true))
    dispatch(push(location.pathname))
  } catch (e) {
    dispatch(notifier.error(`Error while logging in. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while logging in', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
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
    const removePubNubSubscriptionsRequest = Object.keys(generatedSubscriptions).map((key) => {
      return new Promise(async (resolve, reject) => {
        try {
          const subscription = ringcentral.subscriptions.createSubscription()
          subscription.setSubscription(generatedSubscriptions[key])
          await subscription.remove()
          dispatch(subscriptionRemove({id: generatedSubscriptions[key].id, source: 'application'}))
          resolve()
        } catch (e) {
          dispatch(subscriptionRemove({id: generatedSubscriptions[key].id, source: 'application'}))
          reject(e)
        }
      })
    })
    await Promise.all(removePubNubSubscriptionsRequest)
  } catch (e) {
    dispatch(appendToConsole({text: 'Unable to clear all subscriptions. Some subscriptions might have become stale', className: 'info', name: 'general'}))
  }
  dispatch(subscriptionClear('all'))
  try {
    await ringcentral.logout()
  } catch (e) {
    dispatch(appendToConsole({text: 'Error while logging out', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
  }
  dispatch(globalSetIsLoading(false))
  dispatch(setLoggedIn(false))
  dispatch(setAccessToken({}))
  dispatch(push(ROUTES.LOGIN))
}

export const createSubscription = (data) => async (dispatch) => {
  const { eventFilters, transportType, webHookUrl, verificationToken } = data
  dispatch(setMetadata('create', {isLoading: true}))
  dispatch(appendToConsole({text: 'Attempting to create subscription', name: 'general'}))
  const deliveryMode = Object.assign({}, { transportType, address: webHookUrl }, verificationToken && { verificationToken })
  const body = { deliveryMode, eventFilters }
  try {
    const subscriptionData = await ringcentral.createSubscription(body)
    dispatch(notifier.success('Subscription creates successfully'))
    dispatch(appendToConsole({text: `Subscription with id ${subscriptionData.id} successfully created`, className: 'success', name: 'general'}))
    if (transportType === 'PubNub') {
      dispatch(subscriptionSave({data: {[subscriptionData.id]: subscriptionData}, source: 'application'}))
      dispatch(setConsoleActiveTab(subscriptionData.id))
      dispatch(setConsoleHeight(CONSOLE_HEIGHT))
      dispatch(appendToConsole({text: 'Subscription Details', name: subscriptionData.id}))
      dispatch(appendToConsole({text: JSON.stringify(subscriptionData, null, 2), summary: '{...}', canCopy: true, name: subscriptionData.id, collapsible: !!Object.keys(subscriptionData).length, isCode: true}))
      dispatch(appendToConsole({text: 'Listening for notifications', className: 'info', name: subscriptionData.id}))
    }
  } catch (e)  {
    dispatch(notifier.error(`Unable to create subscription. ${e.message}`))
    dispatch(appendToConsole({text: 'Unable to create subscription', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
  }
  dispatch(setMetadata('create', {isLoading: false}))
}

export const getSubscriptions = () => async (dispatch) => {
  dispatch(setMetadata('all', {isLoading: true}))
  try {
    dispatch(appendToConsole({text: 'Fetching all subscriptions', name: 'general'}))
    const json = await ringcentral.listSubscriptions()
    dispatch(appendToConsole({text: 'Succesfully fetched all subscriptions', className: 'success', name: 'general'}))
    dispatch(subscriptionClear('all'))
    const allsubscriptions = json.records.reduce((seed, subscription) => {
      seed[subscription.id] = subscription
      return seed
    }, {})
    dispatch(subscriptionSave({data: allsubscriptions, source: 'all'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to get all subscriptions. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while fetching all subscriptions', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
  }
  dispatch(setMetadata('all', {isLoading: false}))
}

export const getSubscription = (subscriptionId) => async (dispatch) => {
  dispatch(setMetadata('get', {isLoading: true}))
  try {
    dispatch(appendToConsole({text: `Fetching subscription ${subscriptionId}`, name: 'general'}))
    const json = await ringcentral.getSubscription(subscriptionId)
    dispatch(appendToConsole({text: 'Succesfully fetched subscription', className: 'success', name: 'general'}))
    dispatch(subscriptionSave({data: {[json.id]: json}, source: 'individual'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to get subscription. ${e.message}`))
    dispatch(appendToConsole({text: 'Error while fetching subscription', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
  }
  dispatch(setMetadata('get', {isLoading: false}))
}

export const updateSubscription = ({subscriptionId, eventFilters, expiresIn}) => async (dispatch, getState) => {
  dispatch(setMetadata('update', {isLoading: true}))
  dispatch(appendToConsole({text: `Updating subscription ${subscriptionId}`, name: 'general'}))
  const { subscription: { application: generatedSubscriptions } } = getState()
  let subscriptionData = generatedSubscriptions[subscriptionId]
  if (!subscriptionData) {
    dispatch(appendToConsole({text: 'Seems like the subscription was either not created using this application or we do not have the data for this anymore', className: 'info', name: 'general'}))
    dispatch(appendToConsole({text: `Fetching subscription details for id ${subscriptionId}`, name: 'general'}))
  }
  dispatch(appendToConsole({text: `Updating subscription with id ${subscriptionId}`, name: 'general'}))
  try {
    const updatedSubscriptionData = await ringcentral.updateSubscription(subscriptionData, subscriptionId, {eventFilters, expiresIn});
    if (updatedSubscriptionData.deliveryMode.transportType === 'PubNub') {
      dispatch(setConsoleActiveTab(subscriptionData.id))
      dispatch(setConsoleHeight(CONSOLE_HEIGHT))
      dispatch(subscriptionSave({data: {[updatedSubscriptionData.id]: updatedSubscriptionData}, source: 'application'}))
      dispatch(appendToConsole({text: 'Subscription details', name: subscriptionId}))
      dispatch(appendToConsole({text: JSON.stringify(updatedSubscriptionData, null, 2), summary: '{...}', canCopy: true, name: subscriptionId, isCode: true, collapsible: !!Object.keys(updatedSubscriptionData).length}))
      dispatch(appendToConsole({text: 'Listening for notifications', className: 'info', name: subscriptionData.id}))
    }
    dispatch(notifier.success('Subscription updates successfully'))
    dispatch(appendToConsole({text: `Successfully updated subscription with id ${subscriptionId}`, name: 'general', className: 'success'}))
   } catch (e) {
    dispatch(notifier.error(`Unable to update subscription. ${e.message}`))
    dispatch(appendToConsole({text: `Unable to update subscription with id ${subscriptionId}`, className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
   }
   dispatch(setMetadata('update', {isLoading: false}))
}

export const cancelSubscription = (subscriptionId) => async (dispatch, getState) => {
  dispatch(setMetadata('cancel', {isLoading: true}))
  const { subscription: { all: allSubscriptions } } = getState()
  let subscriptionData = allSubscriptions[subscriptionId]
  if (!subscriptionData) {
    dispatch(appendToConsole({text: 'Seems like the subscription was either not created using this application or we do not have the data for this anymore', className: 'info', name: 'general'}))
    dispatch(appendToConsole({text: `Fetching subscription details for id ${subscriptionId}`, name: 'general'}))
  }
  dispatch(appendToConsole({text: `Removing subscription with id ${subscriptionId}`, name: 'general'}))
  try {
    await ringcentral.removeSubscription(subscriptionData, subscriptionId)
    dispatch(notifier.success('Subscription removed successfully'))
    dispatch(appendToConsole({text: `Successfully removed subscription with id ${subscriptionId}`, name: 'general', className: 'success'}))
  } catch (e) {
    dispatch(notifier.error(`Unable to cancel subscription. ${e.message}`))
    dispatch(appendToConsole({text: `Unable to cancel subscription with id ${subscriptionId}`, className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
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
    dispatch(appendToConsole({text: 'Unable to reregister all subscription on page reload', className: 'error', name: 'general'}))
    dispatch(appendToConsole({text: e.message, className: 'error', name: 'general'}))
  }
}


export const reopenConsoleTab = (id) => (dispatch, getState) => {
  const { console: consoleData } = getState()
  // User manually closed the tab. Recreate it
  if (!consoleData[id]) {
    dispatch(appendToConsole({text: 'Listening for notifications', className: 'info', name: id}))
  }
  dispatch(setConsoleActiveTab(id))
  dispatch(setConsoleHeight(CONSOLE_HEIGHT))
}

const platformEventListener = (dispatch) => ({source, event, data, className}) => {
  data = data || {}
  dispatch(appendToConsole({text: `Received Platform event ${event}`, className, name: 'general'}))
  dispatch(appendToConsole({text: 'Event Data', name: 'general'}))
  dispatch(appendToConsole({text: JSON.stringify(data, null, 2), summary: '{...}', canCopy: true, name: 'general', isCode: true, collapsible: !!Object.keys(data).length}))
}

const subscriptionEventListener = (dispatch) => ({source: subscription, event, data, className, subscriptionId}) => {
  dispatch(appendToConsole({text: `Received Subscription event ${event}`, className, name: subscriptionId}))
  dispatch(appendToConsole({text: 'Event Data', name: subscriptionId}))
  dispatch(appendToConsole({text: data ? JSON.stringify(data, null, 2) : '', summary: '{...}', canCopy: true, name: subscriptionId, isCode: true, collapsible: !!Object.keys(data).length}))
  if (event === subscription.events.renewError) {
    dispatch(appendToConsole({text: `Subscription with id ${subscriptionId} failed to renew`, className: 'info', name: 'general'}))
    dispatch(appendToConsole({text: `Removing its data from the application`, className: 'info', name: 'general'}))
    dispatch(subscriptionRemove({id: subscriptionId, source: 'application'}))
  }
  if (event === subscription.events.renewSuccess) {
    const subscriptionData = subscription.subscription()
    dispatch(subscriptionSave({data: {[subscriptionData.id]: subscriptionData}, source: 'application'}))
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