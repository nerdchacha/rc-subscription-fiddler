import { globalSetRequestResponseData, logout } from './actions'

const convertHeadersToObject = (headers) => {
  const h = {}
  for (let pair of headers.entries()) {
    h[pair[0]] = pair[1]
  }
  return h
}

export const monkeyPathFetch = ({dispatch}) => {
  const originalFetch = window.fetch
  window.fetch = (...args) => {
    const clonedRequest = args[0].clone()
    if (!clonedRequest.url.includes('ringcentral')) { return originalFetch(...args) }
    clonedRequest.text().then((requestBody) => {
      dispatch(globalSetRequestResponseData({method: clonedRequest.method, url: clonedRequest.url, body: requestBody, headers: convertHeadersToObject(clonedRequest.headers)}))
    })
    const responsePromise = originalFetch(...args)
    responsePromise.then((response) => {
      const clonedResponse = response.clone()
      const status = clonedResponse.status
      if (status === 401) {
        // Auth token expired OR Unauthorized access. Logout user
        return dispatch(logout())
      }
      clonedResponse.text().then((responseBody) => {
        dispatch(globalSetRequestResponseData({url: clonedResponse.url, status, body: responseBody, headers: convertHeadersToObject(clonedResponse.headers)}))
      })
    })
    return responsePromise
  }
}