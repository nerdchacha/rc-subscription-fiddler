import pubnubSubscribe from './pubnub'

const subscribe = (config, appendToConsole) => {
  if (config.transportType === 'pubnub') {
    pubnubSubscribe(config, appendToConsole)
  } else {
    console.log('Unsupported')
  }
}

export default subscribe