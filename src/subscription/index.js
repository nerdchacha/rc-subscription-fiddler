import pubnubSubscribe from './pubnub'

const subscribe = (config, appendToConsole) => {
  if (config.transportType === 'pubnub') {
    pubnubSubscribe(config, appendToConsole)
  } else {
    appendToConsole({text: 'This feature is unsupported right now', canCopy: false})
  }
}

export default subscribe