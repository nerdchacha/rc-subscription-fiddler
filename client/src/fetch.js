import { appendToConsole, logout, notifier } from './actions'

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
    const responsePromise = originalFetch(...args)
    responsePromise.then((response) => {
      const clonedResponse = response.clone()
      const status = clonedResponse.status
      appendToRequestResponseConsole(clonedRequest, clonedResponse, dispatch)
      if (status === 401) {
        // Auth token expired OR Unauthorized access. Logout user
        // Do not try to logout when 401 is returned for any auth endpoints since the user is not logged in in the first place
        if (clonedRequest.url.includes('/oauth')) { return; }
        dispatch(notifier.warn('Auth token has expired'))
        return dispatch(logout())
      }
    })
    return responsePromise
  }
}

const appendToRequestResponseConsole = (httpRequest, httpResponse, dispatch) => {
  Promise.all([httpRequest.text(), httpResponse.text()]).then(([requestBody, responseBody]) => {
    const request = {method: httpRequest.method, url: httpRequest.url, body: requestBody, headers: convertHeadersToObject(httpRequest.headers)}
    const response = {status: httpResponse.status, body: responseBody, headers: convertHeadersToObject(httpResponse.headers)}
    
    dispatch(appendToConsole({name: 'requestResponse', className: 'success', text: 'Request', canCopy: true , contentToCopy: JSON.stringify(request, null, 2)}))
    dispatch(appendToConsole({name: 'requestResponse', text: `URL : ${request.url}`, isCode: true}))
    dispatch(appendToConsole({name: 'requestResponse', text: `Method : ${request.method}`, isCode: true}))
    if (request.body) { dispatch(appendToConsole({name: 'requestResponse', text: `${request.body}`, summary: 'Body', isCode: true, collapsible: true})) }
    const requestHeaders = Object.keys(request.headers).map((headerName) => `${headerName}|${request.headers[headerName]}`).join('\n')
    dispatch(appendToConsole({name: 'requestResponse', type:'table', text: requestHeaders, summary: 'Headers', collapsible: true, fold: true}))

    dispatch(appendToConsole({className: 'info', name: 'requestResponse', text: 'Response', canCopy: true , contentToCopy: JSON.stringify(response, null, 2)}))
    dispatch(appendToConsole({name: 'requestResponse', text: `Status : ${response.status}`, isCode: true}))
    if (response.body) { dispatch(appendToConsole({name: 'requestResponse', text: `${response.body}`, summary: 'Body', isCode: true, collapsible: true})) }
    const responseHeaders = Object.keys(response.headers).map((headerName) => `${headerName}|${response.headers[headerName]}`).join('\n')
    dispatch(appendToConsole({name: 'requestResponse', type:'table', text: responseHeaders, summary: 'Headers', collapsible: true, fold: true}))
  })
}