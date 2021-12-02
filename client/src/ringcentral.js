import * as RingCentral from '@ringcentral/sdk'
import { Subscriptions } from "@ringcentral/subscriptions";

export let sdk
export let platform
export let subscriptions

const defaultLogger = ({source, event, data}) => {
  console.log(`Received ${source} event ${event}`)
  console.log(JSON.stringify(data, null, 2))
}

let _platformEventListener
let _subscriptionEventListener

export const setup = ({ serverUrl, appKey, appSecret, platformEventListener = defaultLogger, subscriptionEventListener = defaultLogger }) => {
  sdk = new RingCentral.SDK({
    server: serverUrl,
    clientId: appKey,
    clientSecret: appSecret,
    redirectUri: `${process.env.REACT_APP_SERVER_BASE_URL}/redirect.html`
  });
  _platformEventListener = platformEventListener
  _subscriptionEventListener = subscriptionEventListener
  platform = sdk.platform()
  subscriptions = new Subscriptions({ sdk });
  platform.on(platform.events.loginSuccess, (data) => _platformEventListener({source: 'PLATFORM', event: 'LOGIN SUCCESS', data, type: 'success'}))
  platform.on(platform.events.loginError, (data) => _platformEventListener({source: 'PLATFORM', event: 'LOGIN ERROR', data, type: 'error'}))
  platform.on(platform.events.logoutSuccess, (data) => _platformEventListener({source: 'PLATFORM', event: 'LOGOUT SUCCESS', data, type: 'success'}))
  platform.on(platform.events.logoutError, (data) => _platformEventListener({source: 'PLATFORM', event: 'LOGOUT ERROR', data, type: 'error'}))
  platform.on(platform.events.refreshSuccess, (data) => _platformEventListener({source: 'PLATFORM', event: 'REFRESH SUCCESS', data, type: 'success'}))
  platform.on(platform.events.refreshError, (data) => _platformEventListener({source: 'PLATFORM', event: 'REFRESH ERROR', data, type: 'error'}))
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

export const subscribe = async ({eventFilters}) => {
  const subscription = subscriptions.createSubscription();
  registerSubscriptionEvents(subscription)
  await subscription.setEventFilters(eventFilters).register();
  return subscription
}

export const registerSubscriptionEvents = (subscription) => {
  subscription.on(subscription.events.notification, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'NOTIFICATION', data, type: 'success'}))
  subscription.on(subscription.events.removeSuccess, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'REMOVE SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.removeError, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'REMOVE ERROR', data, type: 'error'}))
  subscription.on(subscription.events.renewSuccess, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'RENEW SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.renewError, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'RENEW ERROR', data, type: 'error'}))
  subscription.on(subscription.events.subscribeSuccess, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'SUBSCRIPTION SUCCESS', data, type: 'success'}))
  subscription.on(subscription.events.subscribeError, (data) => _subscriptionEventListener({source: 'SUBSCRIPTION', event: 'SUBSCRIPTION ERROR', data, type: 'error'}))
}