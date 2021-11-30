import { push } from 'connected-react-router'

import { createSDK, getSDK } from '../sdk'

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
  const sdk = createSDK({ serverUrl, appKey, appSecret })
  const platform = sdk.platform()
  dispatch(globalSetIsLoading(true))
  let tokenResponse
  try {
    if (loginType === '3LeggedLogin') {
      const codeResponse = await platform.loginWindow({ url: platform.loginUrl({ implicit: false, usePKCE: true }), origin: process.env.REACT_APP_SERVER_BASE_URL })
      tokenResponse = await platform.login(codeResponse)
    } else {
      tokenResponse = await platform.login({ username, password, extension })
    }
    const token = await tokenResponse.json()
    dispatch(setLoggedIn(true))
    dispatch(setAccessToken(token))
    dispatch(globalSetIsLoading(false))
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
  const sdk = createSDK({ serverUrl, appKey, appSecret })
  const platform = sdk.platform()
  dispatch(globalSetIsLoading(true))
  try {
    await platform.login(token)
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
  const sdk = getSDK()
  dispatch(globalSetIsLoading(true))
  await sdk.platform().logout()
  dispatch(globalSetIsLoading(false))
  dispatch(setLoggedIn(false))
  dispatch(setAccessToken({}))
  dispatch(push('/login'))
} 