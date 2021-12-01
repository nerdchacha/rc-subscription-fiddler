import { push } from 'connected-react-router'

import * as ringcentral from '../ringcentral'

export const CONOSLE_APPEND = 'CONSOLE_APPEND'
export const CONSOLE_CLEAR = 'CONSOLE_CLEAR'
export const AUTH_SET_LOGGED_IN = 'AUTH_SET_LOGGED_IN'
export const GLOBAL_SET_IS_LOADING = 'GLOBAL_SET_IS_LOADING'
export const AUTH_SET_LOGIN_DETAILS = 'AUTH_SET_LOGIN_DETAILS'
export const AUTH_SET_ACCESS_TOKEN = 'AUTH_SET_ACCESS_TOKEN'
export const GLOBAL_REQUEST_RESPONSE_SET_DATA = 'GLOBAL_REQUEST_RESPONSE_SET_DATA'

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

export const login = () => async (dispatch, getState) => {
  const { auth: { loginDetails } } = getState()
  const { serverUrl, appKey, appSecret, loginType, username, password, extension } = loginDetails
  try {
    ringcentral.setup({serverUrl, appKey, appSecret, logger: logger(dispatch)})
    const token = await ringcentral.login({type: loginType, username, password, extension})
    dispatch(setLoggedIn(true))
    dispatch(setAccessToken(token))
    dispatch(push('/create-subscription'))
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
  ringcentral.setup({serverUrl, appKey, appSecret, logger: logger(dispatch)})
  dispatch(globalSetIsLoading(true))
  try {
    ringcentral.setToken(token)
    dispatch(setLoggedIn(true))
    dispatch(push('/create-subscription'))
  } catch (e) {
    // TODO: Show this somewhere
    console.log(e.message)
    dispatch(setLoggedIn(false))
    dispatch(setAccessToken({}))
  } finally {
    dispatch(globalSetIsLoading(false))
  }
}

export const logout = () => async (dispatch) => {
  dispatch(globalSetIsLoading(true))
  await ringcentral.logout()
  dispatch(globalSetIsLoading(false))
  dispatch(setLoggedIn(false))
  dispatch(setAccessToken({}))
  dispatch(push('/login'))
}

export const createSubscription = ({eventFilters}) => async (dispatch) => {
  dispatch(appendToConsole({text: 'Attempting to start subscription...', type: 'info', name: 'createSubscription'}))
  try {
    await ringcentral.subscribe({eventFilters})
    dispatch(appendToConsole({text: 'Subscription successful', type: 'success', name: 'createSubscription'}))
    dispatch(appendToConsole({text: 'Subscription details', type: 'info', name: 'createSubscription'}))
    dispatch(appendToConsole({text: JSON.stringify(ringcentral.subscription._subscription, null, 2), canCopy: true, name: 'createSubscription'}))
    dispatch(appendToConsole({text: 'Listening for notifications...', type: 'info', name: 'createSubscription'}))
  } catch (e)  {
    dispatch(appendToConsole({text: 'Unable to register subscription', type: 'error', name: 'createSubscription'}))
    dispatch(appendToConsole({text: JSON.stringify(e, null, 2), canCopy: true, name: 'createSubscription'}))
  }
}

export const getSubscriptions = () => async (dispatch) => {
  const platform = ringcentral.platform()
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
  const platform = ringcentral.platform()
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

const logger = (dispatch) => ({source, event, data, type}) => {
  const consoleName = source === 'SUBSCRIPTION' ? 'createSubscription' : 'platform'
  dispatch(appendToConsole({text: `Received ${source} event ${event}`, type, name: consoleName}))
  dispatch(appendToConsole({text: 'Event Data', name: consoleName}))
  dispatch(appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true, name: consoleName}))
}