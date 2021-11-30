import pubnubSubscribe from './pubnub'

const subscribe = (data, appendToConsole) => {
  if (data.transportType === 'pubnub') {
    pubnubSubscribe(data, appendToConsole)
  } else {
    appendToConsole({text: 'This feature is unsupported right now', canCopy: false})
  }
}

export default subscribe