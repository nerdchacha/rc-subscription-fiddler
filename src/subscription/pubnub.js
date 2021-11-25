const RC = require('ringcentral');

const logEventMessage = (type, event, data, appendToConsole) => {
  appendToConsole({text: `Received ${type} event ${event}`})
  if (data) {
    appendToConsole({text: 'Event Data'})
    appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true})
  }
}

const subscribe = async (config, appendToConsole) => {
  const { serverUrl, appKey, appSecret, username, password, extension, eventFilters } = config
  const sdk = new RC({
    server: serverUrl,
    appKey,
    appSecret
  });
  const platform = sdk.platform();
  const subscription = sdk.createSubscription();

  try {
    const response = await platform.login({ username, password, extension })
    appendToConsole({text: 'Succesfully logged into the RingCental Account'})
    appendToConsole({text: 'The auth API response is'})
    appendToConsole({text: JSON.stringify(response.json(), null, 2), canCopy: true})
  } catch (e) {
    appendToConsole({text: 'Unable to log into RingCentral Platform'})
    appendToConsole({text: JSON.stringify(e, null, 2), canCopy: true})
  }
  appendToConsole({text: 'Attempting to start subscription'})
  subscription.setEventFilters(eventFilters).register();
  
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