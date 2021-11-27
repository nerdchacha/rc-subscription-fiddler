import * as RingCentral from '@ringcentral/sdk';
import { Subscriptions } from "@ringcentral/subscriptions";


const logEventMessage = (type, event, data, appendToConsole) => {
  appendToConsole({text: `Received ${type} event ${event}`})
  if (data) {
    appendToConsole({text: 'Event Data'})
    appendToConsole({text: JSON.stringify(data, null, 2), canCopy: true})
  }
}

const subscribe = async (config, appendToConsole) => {
  const { serverUrl, appKey, appSecret, username, password, extension, eventFilters } = config
  // const sdk = new RingCentral.SDK({
  //   server: serverUrl,
  //   clientId: appKey,
  //   clientSecret: appSecret,
  // });
  const sdk = new RingCentral.SDK({
    server: serverUrl,
    clientId: 'lfCbE1l5TX6Uu-tDNeDDzA',
    clientSecret: 's407OrbFSUaKGEqBXqzMuAZY2qAjaQROexPRWlerD0Fw',
    redirectUri: `${process.env.REACT_APP_SERVER_BASE_URL}/redirect.html`
  });
  const platform = sdk.platform()
  platform
    .loginWindow({ url: platform.loginUrl({ implicit: false, usePKCE: false }), origin: process.env.REACT_APP_SERVER_BASE_URL })
    .then(platform.login.bind(platform))
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch(function(e) {
        console.error(e.stack || e.message);
        alert('Auth error\n\n' + e.message);
    });
  // try {
  //   const response = await sdk.login({ username, password, extension })
  //   appendToConsole({text: 'Succesfully logged into the RingCental Account'})
  //   appendToConsole({text: 'User details:'})
  //   appendToConsole({text: JSON.stringify(await response.json(), null, 2), canCopy: true})
  // } catch (e) {
  //   appendToConsole({text: 'Unable to log into RingCentral Platform'})
  //   appendToConsole({text: JSON.stringify(e, null, 2), canCopy: true})
  //   return
  // }
  // appendToConsole({text: 'Attempting to start subscription'})
  // const subscriptions = new Subscriptions({ sdk });
  // const subscription = subscriptions.createSubscription();
  // subscription.setEventFilters(eventFilters).register();
  
  // platform.on(platform.events.loginSuccess, (data) => logEventMessage('PLATFORM', 'LOGIN SUCCESS', data, appendToConsole))
  // platform.on(platform.events.loginError, (data) => logEventMessage('PLATFORM', 'LOGIN ERROR', data, appendToConsole))
  // platform.on(platform.events.logoutSuccess, (data) => logEventMessage('PLATFORM', 'LOGOUT SUCCESS', data, appendToConsole))
  // platform.on(platform.events.logoutError, (data) => logEventMessage('PLATFORM', 'LOGOUT ERROR', data, appendToConsole))
  // platform.on(platform.events.refreshSuccess, (data) => logEventMessage('PLATFORM', 'REFRESH SUCCESS', data, appendToConsole))
  // platform.on(platform.events.refreshError, (data) => logEventMessage('PLATFORM', 'REFRESH ERROR', data, appendToConsole))

  // subscription.on(subscription.events.notification, (data) => logEventMessage('SUBSCRIPTION', 'NOTIFICATION', data, appendToConsole))
  // subscription.on(subscription.events.removeSuccess, (data) => logEventMessage('SUBSCRIPTION', 'REMOVE SUCCESS', data, appendToConsole))
  // subscription.on(subscription.events.removeError, (data) => logEventMessage('SUBSCRIPTION', 'REMOVE ERROR', data, appendToConsole))
  // subscription.on(subscription.events.renewSuccess, (data) => logEventMessage('SUBSCRIPTION', 'RENEW SUCCESS', data, appendToConsole))
  // subscription.on(subscription.events.renewError, (data) => logEventMessage('SUBSCRIPTION', 'RENEW ERROR', data, appendToConsole))
  // subscription.on(subscription.events.subscribeSuccess, (data) => logEventMessage('SUBSCRIPTION', 'SUBSCRIPTION SUCCESS', data, appendToConsole))
  // subscription.on(subscription.events.subscribeError, (data) => logEventMessage('SUBSCRIPTION', 'SUBSCRIPTION ERROR', data, appendToConsole))
}

export default subscribe