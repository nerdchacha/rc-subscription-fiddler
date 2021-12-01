import * as RingCentral from '@ringcentral/sdk'
import { Subscriptions } from "@ringcentral/subscriptions";

export let sdk
export let platform
export let subscription

const defaultLogger = ({source, event, data}) => {
  console.log(`Received ${source} event ${event}`)
  console.log(JSON.stringify(data, null, 2))
}

export const setup = ({ serverUrl, appKey, appSecret, logger = defaultLogger }) => {
  sdk = new RingCentral.SDK({
    server: serverUrl,
    clientId: appKey,
    clientSecret: appSecret,
    redirectUri: `${process.env.REACT_APP_SERVER_BASE_URL}/redirect.html`
  });
  platform = sdk.platform()
  const subscriptions = new Subscriptions({ sdk });
  subscription = subscriptions.createSubscription();
  platform.on(platform.events.loginSuccess, (data) => logger({source: 'PLATFORM', event: 'LOGIN SUCCESS', data, type: 'success'}))
  platform.on(platform.events.loginError, (data) => logger({source: 'PLATFORM', event: 'LOGIN ERROR', data, type: 'error'}))
  platform.on(platform.events.logoutSuccess, (data) => logger({source: 'PLATFORM', event: 'LOGOUT SUCCESS', data, type: 'success'}))
  platform.on(platform.events.logoutError, (data) => logger({source: 'PLATFORM', event: 'LOGOUT ERROR', data, type: 'error'}))
  platform.on(platform.events.refreshSuccess, (data) => logger({source: 'PLATFORM', event: 'REFRESH SUCCESS', data, type: 'success'}))
  platform.on(platform.events.refreshError, (data) => logger({source: 'PLATFORM', event: 'REFRESH ERROR', data, type: 'error'}))

  subscription.on(subscription.events.notification, (data) => logger({source: 'SUBSCRIPTION', event: 'NOTIFICATION', data, type: 'success'}))
  subscription.on(subscription.events.removeSuccess, (data) => logger({source: 'SUBSCRIPTION', event: 'REMOVE SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.removeError, (data) => logger({source: 'SUBSCRIPTION', event: 'REMOVE ERROR', data, type: 'error'}))
  subscription.on(subscription.events.renewSuccess, (data) => logger({source: 'SUBSCRIPTION', event: 'RENEW SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.renewError, (data) => logger({source: 'SUBSCRIPTION', event: 'RENEW ERROR', data, type: 'error'}))
  subscription.on(subscription.events.subscribeSuccess, (data) => logger({source: 'SUBSCRIPTION', event: 'SUBSCRIPTION SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.subscribeError, (data) => logger({source: 'SUBSCRIPTION', event: 'SUBSCRIPTION ERROR', data, type: 'error'}))
}

export const login = async ({type, username, password, extension }) => {
  let tokenResponse
  if (type === '3LeggedLogin') {
    const codeResponse = await platform.loginWindow({ url: platform.loginUrl({ implicit: false, usePKCE: true }), origin: process.env.REACT_APP_SERVER_BASE_URL })
    tokenResponse = await platform.login(codeResponse)
  } else {
    tokenResponse = await platform.login({ username, password, extension })
  }
  const token = await tokenResponse.json()
  return token
}

export const setToken = (token) => platform.login(token)

export const logout = () => platform.logout()

export const subscribe = ({eventFilters}) => subscription.setEventFilters(eventFilters).register();