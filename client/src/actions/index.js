import { push } from 'connected-react-router'

import * as ringcentral from '../ringcentral'
import { ROUTES } from '../constants'

export const CONOSLE_APPEND = 'CONSOLE_APPEND'
export const CONSOLE_CLEAR = 'CONSOLE_CLEAR'
export const AUTH_SET_LOGGED_IN = 'AUTH_SET_LOGGED_IN'
export const GLOBAL_SET_IS_LOADING = 'GLOBAL_SET_IS_LOADING'
export const AUTH_SET_LOGIN_DETAILS = 'AUTH_SET_LOGIN_DETAILS'
export const AUTH_SET_ACCESS_TOKEN = 'AUTH_SET_ACCESS_TOKEN'
export const GLOBAL_REQUEST_RESPONSE_SET_DATA = 'GLOBAL_REQUEST_RESPONSE_SET_DATA'
export const SUBSCRIPTION_SAVE = 'SUBSCRIPTION_SAVE'
export const SUBSCRIPTION_REMOVE = 'SUBSCRIPTION_REMOVE'
export const SUBSCRIPTION_CLEAR = 'SUBSCRIPTION_CLEAR'
export const SUBSCRIPTION_SET_METADATA  = 'SUBSCRIPTION_SET_METADATA'
export const SET_IS_LOADING = 'SET_IS_LOADING'

export const appendToConsole = ({text, canCopy, type = 'text', name}) => ({type: CONOSLE_APPEND, data: {text, canCopy, type}, name})
export const clearConsole = (name) => ({type: CONSOLE_CLEAR, name})
export const setLoggedIn = (isLoggedIn) => ({type: AUTH_SET_LOGGED_IN, isLoggedIn})
export const globalSetIsLoading = (isLoading) => ({type: GLOBAL_SET_IS_LOADING, isLoading})
export const setLoginDetails = (details) => ({type: AUTH_SET_LOGIN_DETAILS, details})
export const setAccessToken = (token) => ({type: AUTH_SET_ACCESS_TOKEN, token})
export const globalSetRequestResponseData = (data) => ({type: GLOBAL_REQUEST_RESPONSE_SET_DATA, data})
export const subscriptionSave = ({data, process, source = 'application'}) => ({type: SUBSCRIPTION_SAVE, data, process, source})
export const subscriptionRemove = ({id, source = 'application'}) => ({type: SUBSCRIPTION_REMOVE, id, source})
export const subscriptionClear = (source = 'application') => ({type: SUBSCRIPTION_CLEAR, source})
export const subscriptionSetMetadata = ({id, metadata}) => ({type: SUBSCRIPTION_SET_METADATA, id, metadata})

export const login = () => async (dispatch, getState) => {
  const { auth: { loginDetails } } = getState()
  const { serverUrl, appKey, appSecret, loginType, username, password, extension } = loginDetails
  try {
    ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
    if (loginType === 'password') { dispatch(globalSetIsLoading(true, 'auth')) }
    const token = await ringcentral.login({type: loginType, username, password, extension})
    dispatch(setLoggedIn(true))
    dispatch(setAccessToken(token))
    dispatch(globalSetIsLoading(false))
    dispatch(push(ROUTES.CREATE_SUBSCRIPTION))
  } catch (e) {
    // TODO: Show this somewhere
    console.log(e.message)
    dispatch(setLoggedIn(false))
    dispatch(globalSetIsLoading(false))
    dispatch(setAccessToken({}))
  }
}

export const loginUsingAccessToken = () => async (dispatch, getState) => {
  const { auth: { loginDetails, isLoggedIn, token }, router: { location } } = getState()
  if (!isLoggedIn) { return }
  const { serverUrl, appKey, appSecret } = loginDetails
  ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
  dispatch(globalSetIsLoading(true))
  // TODO: reset subscription using stored data
  try {
    ringcentral.setToken(token)
    dispatch(setLoggedIn(true))
    dispatch(push(location.pathname))
  } catch (e) {
    // TODO: Show this somewhere
    console.log(e.message)
    dispatch(setLoggedIn(false))
    dispatch(setAccessToken({}))
  } finally {
    dispatch(globalSetIsLoading(false))
  }
}

export const logout = () => async (dispatch, getState) => {
  dispatch(globalSetIsLoading(true))
  // Remove all subscriptions on logout
  const { subscription: { application: generatedSubscriptions } } = getState()
  try {
    const removeAllSubscriptionsRequest = Object.keys(generatedSubscriptions).map((key) => {
      const subscription = ringcentral.subscriptions.createSubscription()
        subscription.setSubscription(generatedSubscriptions[key])
        return subscription.remove()
    })
    await Promise.all(removeAllSubscriptionsRequest)
  } catch (e) {
    console.log('Unabel to clean all subscriptions')
    console.log(e.message)
  }
  dispatch(subscriptionClear('application'))
  dispatch(subscriptionClear('all'))
  try {
    await ringcentral.logout()
  } catch (e) {
    console.log('Unabel to logout')
    console.log(e.message)
  }
  dispatch(globalSetIsLoading(false))
  dispatch(setLoggedIn(false))
  dispatch(setAccessToken({}))
  dispatch(push(ROUTES.LOGIN))
}

export const createSubscription = ({eventFilters}) => async (dispatch) => {
  dispatch(appendToConsole({text: 'Attempting to start subscription...', type: 'info', name: 'createSubscription'}))
  try {
    const subscription = await ringcentral.subscribe({eventFilters})
    const subscriptionData = subscription.subscription()
    dispatch(subscriptionSave({data: subscriptionData, source: 'application'}))
    dispatch(appendToConsole({text: 'Subscription successful', type: 'success', name: 'createSubscription'}))
    dispatch(appendToConsole({text: 'Subscription details', type: 'info', name: 'createSubscription'}))
    dispatch(appendToConsole({text: JSON.stringify(subscriptionData, null, 2), canCopy: true, name: 'createSubscription'}))
    dispatch(appendToConsole({text: 'Listening for notifications...', type: 'info', name: 'createSubscription'}))
  } catch (e)  {
    dispatch(appendToConsole({text: 'Unable to register subscription', type: 'error', name: 'createSubscription'}))
    dispatch(appendToConsole({text: JSON.stringify(e, null, 2), canCopy: true, name: 'createSubscription'}))
  }
}

export const getSubscriptions = () => async (dispatch) => {
  const platform = ringcentral.platform
  try {
    const response = await platform.get('/restapi/v1.0/subscription')
    const json = await response.json()
    dispatch(subscriptionClear('all'))
    const allsubscriptions = json.records.reduce((seed, subscription) => {
      seed[subscription.id] = subscription
      return seed
    }, {})
    dispatch(subscriptionSave({data: allsubscriptions, source: 'all', process: 'batch'}))
  } catch (e) {
    // TODO: write to other console
    console.log(e)
  }
}

export const getSubscription = (subscriptionId) => async (dispatch) => {
  const platform = ringcentral.platform
  try {
    const response = await platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    const json = await response.json()
    dispatch(subscriptionSave({data: json, source: 'individual', process: 'batch'}))
  } catch (e) {
    // TODO: write to other console
    console.log(e)
  }
}

export const updateSubscription = ({subscriptionId, eventFilters}) => async (dispatch, getState) => {
  const { subscription: { application: generatedSubscriptions } } = getState()
  let subscriptionData = generatedSubscriptions[subscriptionId]
  if (!subscriptionData) {
    const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    subscriptionData = await response.json()
  }
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  dispatch(appendToConsole({text: 'Updaing subscription...', name: 'updateSubscription', type: 'info'}))
  await subscription.setEventFilters(eventFilters).register();
  const updatedSubscriptionData = Object.assign(subscriptionData, {eventFilters})
  dispatch(subscriptionSave({data: updatedSubscriptionData, source: 'application'}))
  dispatch(appendToConsole({text: 'Successfully updated subscription', name: 'updateSubscription', type: 'success'}))
  dispatch(appendToConsole({text: 'Subscription details', type: 'info', name: 'updateSubscription'}))
  dispatch(appendToConsole({text: JSON.stringify(updatedSubscriptionData, null, 2), canCopy: true, name: 'updateSubscription'}))
}

export const cancelSubscription = (subscriptionId) => async (dispatch, getState) => {
  const { subscription: { application: generatedSubscriptions } } = getState()
  let subscriptionData = generatedSubscriptions[subscriptionId]
  if (!subscriptionData) {
    const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    subscriptionData = await response.json()
  }
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  await subscription.remove()
  dispatch(subscriptionRemove({id: subscriptionId, source: 'application'}))
  dispatch(subscriptionRemove({id: subscriptionId, source: 'all'}))
  dispatch(subscriptionRemove({id: subscriptionId, source: 'individual'}))
}

export const cancelSubscriptionAndGetAllSubscriptions = (subscriptionId) => async (dispatch) => {
  await dispatch(cancelSubscription(subscriptionId))
  await dispatch(getSubscriptions())
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
    //TODO: Unable to reregister some subscription. Maybe they are dead on the server?
    console.log(e.message)
  }
}

const platformEventListener = (dispatch) => ({source, event, data, type}) => {
  dispatch(appendToConsole({text: `Received ${source} event ${event}`, type, name: 'platform'}))
  dispatch(appendToConsole({text: 'Event Data', name: 'platform'}))
  dispatch(appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true, name: 'platform'}))
}

const subscriptionEventListener = (dispatch) => ({source: subscription, event, data, type, subscriptionId}) => {
  dispatch(appendToConsole({text: `Received ${subscription.constructor.name} event ${event}`, type, name: 'createSubscription'}))
  dispatch(appendToConsole({text: 'Event Data', name: 'createSubscription'}))
  dispatch(appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true, name: 'createSubscription'}))
  if (event === subscription.events.renewError) {
    // Remove subscription from store
    dispatch(subscriptionRemove({id: subscriptionId}))
  }
  if (event === subscription.events.renewSuccess) {
    // Update redux store
    dispatch(subscriptionSave({data: subscription.subscription(), source: 'application'}))
  }
}