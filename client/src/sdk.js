import * as RingCentral from '@ringcentral/sdk';

let instance = null

export const createSDK = ({serverUrl, appKey, appSecret}) => {
  instance = new RingCentral.SDK({
    server: serverUrl,
    clientId: appKey,
    clientSecret: appSecret,
    redirectUri: `${process.env.REACT_APP_SERVER_BASE_URL}/redirect.html`
  });
  return instance
}

export const getSDK = () => instance