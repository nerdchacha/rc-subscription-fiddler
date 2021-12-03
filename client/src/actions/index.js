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

export const appendToConsole = ({text, canCopy, type = 'text', name}) => ({type: CONOSLE_APPEND, data: {text, canCopy, type}, name})
export const clearConsole = (name) => ({type: CONSOLE_CLEAR, name})
export const openConfigurationModal = () => ({type: 'showModal', showModal: true})
export const closeConfigurationModal = () => ({type: 'showModal', showModal: false})
export const setConfigurationData = (data) => ({type: 'setConfiguration', data})
export const setLoggedIn = (isLoggedIn) => ({type: AUTH_SET_LOGGED_IN, isLoggedIn})
export const globalSetIsLoading = (isLoading) => ({type: GLOBAL_SET_IS_LOADING, isLoading})
export const setLoginDetails = (details) => ({type: AUTH_SET_LOGIN_DETAILS, details})
export const setAccessToken = (token) => ({type: AUTH_SET_ACCESS_TOKEN, token})
export const globalSetRequestResponseData = (data) => ({type: GLOBAL_REQUEST_RESPONSE_SET_DATA, data})
export const subscriptionSave = (data) => ({type: SUBSCRIPTION_SAVE, data})
export const subscriptionRemove = (id) => ({type: SUBSCRIPTION_REMOVE, id})
export const subscriptionClear = () => ({type: SUBSCRIPTION_CLEAR})

export const login = () => async (dispatch, getState) => {
  const { auth: { loginDetails } } = getState()
  const { serverUrl, appKey, appSecret, loginType, username, password, extension } = loginDetails
  try {
    ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
    dispatch(globalSetIsLoading(true))
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
  const { auth: { loginDetails, isLoggedIn, token } } = getState()
  if (!isLoggedIn) { return }
  const { serverUrl, appKey, appSecret } = loginDetails
  ringcentral.setup({serverUrl, appKey, appSecret, platformEventListener: platformEventListener(dispatch), subscriptionEventListener: subscriptionEventListener(dispatch)})
  dispatch(globalSetIsLoading(true))
  // TODO: reset subscription using stored data
  try {
    ringcentral.setToken(token)
    dispatch(setLoggedIn(true))
    dispatch(push(ROUTES.CREATE_SUBSCRIPTION))
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
  const { subscription: allSubscriptions } = getState()
  const removeAllSubscriptionsRequest = Object.keys(allSubscriptions).map((key) => {
    const subscription = ringcentral.subscriptions.createSubscription()
      subscription.setSubscription(allSubscriptions[key])
      return subscription.remove()
  })
  await Promise.all(removeAllSubscriptionsRequest)
  dispatch(subscriptionClear())
  await ringcentral.logout()
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
    dispatch(subscriptionSave(subscriptionData))
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
  dispatch(appendToConsole({text: 'Fetching all subscriptions...', type: 'info', name: 'getSubscriptions'}))
  try {
    const response = await platform.get('/restapi/v1.0/subscription')
    const json = await response.json()
    dispatch(appendToConsole({text: 'Successfully fetched all subscriptions', type: 'success', name: 'getSubscriptions'}))
    dispatch(appendToConsole({text: JSON.stringify(json, null, 2), canCopy: true, name: 'getSubscriptions'}))
  } catch (e) {
    dispatch(appendToConsole({text: 'Error fetching subscriptions', type: 'error', name: 'getSubscriptions'}))
    dispatch(appendToConsole({text: e.message, canCopy: true, name: 'getSubscriptions'}))
  }
}

export const getSubscription = (subscriptionId) => async (dispatch) => {
  const platform = ringcentral.platform
  dispatch(appendToConsole({text: `Fetching subscription for Subscription Id ${subscriptionId}...`, type: 'info', name: 'getSubscription'}))
  try {
    const response = await platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    const json = await response.json()
    dispatch(appendToConsole({text: 'Successfully fetched subscription', type: 'success', name: 'getSubscription'}))
    dispatch(appendToConsole({text: JSON.stringify(json, null, 2), canCopy: true, name: 'getSubscription'}))
  } catch (e) {
    dispatch(appendToConsole({text: 'Error fetching subscription', type: 'error', name: 'getSubscription'}))
    dispatch(appendToConsole({text: e.message, canCopy: true, name: 'getSubscription'}))
  }
}

export const updateSubscription = ({subscriptionId, eventFilters}) => async (dispatch, getState) => {
  const { subscription: allSUbscriptions } = getState()
  let subscriptionData = allSUbscriptions[subscriptionId]
  if (!subscriptionData) {
    const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    subscriptionData = await response.json()
  }
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  dispatch(appendToConsole({text: 'Updaing subscription...', name: 'updateSubscription', type: 'info'}))
  await subscription.setEventFilters(eventFilters).register();
  const updatedSubscriptionData = Object.assign(subscriptionData, {eventFilters})
  dispatch(subscriptionSave(updatedSubscriptionData))
  dispatch(appendToConsole({text: 'Successfully updated subscription', name: 'updateSubscription', type: 'success'}))
  dispatch(appendToConsole({text: 'Subscription details', type: 'info', name: 'updateSubscription'}))
  dispatch(appendToConsole({text: JSON.stringify(updatedSubscriptionData, null, 2), canCopy: true, name: 'updateSubscription'}))
}

export const cancelSubscription = (subscriptionId) => async (dispatch, getState) => {
  const { subscription: allSUbscriptions } = getState()
  let subscriptionData = allSUbscriptions[subscriptionId]
  if (!subscriptionData) {
    const response = await ringcentral.platform.get(`/restapi/v1.0/subscription/${subscriptionId}`)
    subscriptionData = await response.json()
  }
  const subscription = ringcentral.subscriptions.createSubscription()
  subscription.setSubscription(subscriptionData)
  dispatch(appendToConsole({text: 'Cancelling subscription...', name: 'cancelSubscription', type: 'info'}))
  await subscription.remove()
  dispatch(appendToConsole({text: 'Subscription successfully cancelled', name: 'cancelSubscription', type: 'success'}))
  if (subscriptionId) {
    // TODO: Subscription was not created using the app
    dispatch(subscriptionRemove(subscriptionId))
  }
}

export const reregisterSubscriptionEvents = () => async (dispatch, getState) => {
  const { subscription: allSUbscriptions } = getState()
  try {
    Object.keys(allSUbscriptions).forEach((key) => {
      const subscription = ringcentral.subscriptions.createSubscription()
      subscription.setSubscription(allSUbscriptions[key])
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

const subscriptionEventListener = (dispatch) => ({source: subscription, event, data, type}) => {
  dispatch(appendToConsole({text: `Received ${subscription.constructor.name} event ${event}`, type, name: 'createSubscription'}))
  dispatch(appendToConsole({text: 'Event Data', name: 'createSubscription'}))
  dispatch(appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true, name: 'createSubscription'}))
  if (event === subscription.events.renewError) {
    // // Update redux store
    dispatch(subscriptionRemove(subscription.subscription().id))
  }
  if (event === subscription.events.renewSuccess) {
    // Update redux store
    dispatch(subscriptionSave(subscription.subscription()))
  }
}