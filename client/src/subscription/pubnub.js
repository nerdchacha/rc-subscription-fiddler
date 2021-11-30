import { Subscriptions } from "@ringcentral/subscriptions";

import { getSDK } from '../sdk'

const logEventMessage = (type, event, data, appendToConsole) => {
  appendToConsole({text: `Received ${type} event ${event}`, type: 'success'})
  if (data) {
    appendToConsole({text: 'Event Data'})
    appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true})
  }
}

const subscribe = async (data, appendToConsole) => {
  const { eventFilters } = data
  const sdk = getSDK()
  const platform = sdk.platform()
  appendToConsole({text: 'Attempting to start subscription...', type: 'info'})
  const subscriptions = new Subscriptions({ sdk });
  let subscription
  try {
    subscription = subscriptions.createSubscription();
    await subscription.setEventFilters(eventFilters).register();
  } catch (e) {
    appendToConsole({text: 'Unable to register subscription', type: 'error'})
    appendToConsole({text: JSON.stringify(e, null, 2), canCopy: true})
    return
  }
  appendToConsole({text: 'Subscription successful', type: 'success'})
  appendToConsole({text: 'Subscription details', type: 'info'})
  appendToConsole({text: JSON.stringify(subscription._subscription, null, 2), canCopy: true})
  appendToConsole({text: 'Listening for notifications...', type: 'info'})
  
  platform.on(platform.events.loginSuccess, (data) => logEventMessage('PLATFORM', 'LOGIN SUCCESS', data, appendToConsole))
  platform.on(platform.events.loginError, (data) => logEventMessage('PLATFORM', 'LOGIN ERROR', data, appendToConsole))
  platform.on(platform.events.logoutSuccess, (data) => logEventMessage('PLATFORM', 'LOGOUT SUCCESS', data, appendToConsole))
  platform.on(platform.events.logoutError, (data) => logEventMessage('PLATFORM', 'LOGOUT ERROR', data, appendToConsole))
  platform.on(platform.events.refreshSuccess, (data) => logEventMessage('PLATFORM', 'REFRESH SUCCESS', data, appendToConsole))
  platform.on(platform.events.refreshError, (data) => logEventMessage('PLATFORM', 'REFRESH ERROR', data, appendToConsole))

  subscription.on(subscription.events.notification, (data) => logEventMessage('SUBSCRIPTION', 'NOTIFICATION', data, appendToConsole))
  subscription.on(subscription.events.removeSuccess, (data) => logEventMessage('SUBSCRIPTION', 'REMOVE SUCCESS', data, appendToConsole))
  subscription.on(subscription.events.removeError, (data) => logEventMessage('SUBSCRIPTION', 'REMOVE ERROR', data, appendToConsole))
  subscription.on(subscription.events.renewSuccess, (data) => logEventMessage('SUBSCRIPTION', 'RENEW SUCCESS', data, appendToConsole))
  subscription.on(subscription.events.renewError, (data) => logEventMessage('SUBSCRIPTION', 'RENEW ERROR', data, appendToConsole))
  subscription.on(subscription.events.subscribeSuccess, (data) => logEventMessage('SUBSCRIPTION', 'SUBSCRIPTION SUCCESS', data, appendToConsole))
  subscription.on(subscription.events.subscribeError, (data) => logEventMessage('SUBSCRIPTION', 'SUBSCRIPTION ERROR', data, appendToConsole))
}

export default subscribe