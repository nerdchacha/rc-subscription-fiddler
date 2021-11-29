export const monkeyPathFetch = () => {
  const originalFetch = window.fetch
  window.fetch = (...args) => {
    const clonedRequest = args[0].clone()
    if (!clonedRequest.url.includes('ringcentral')) { return }
    // TODO: Show on UI
    console.log(clonedRequest)
    const responsePromise = originalFetch(...args)
    responsePromise.then((response) => {
      const clonedResponse = response.clone()
      // TODO: Show on UI
      console.log(clonedResponse)
    })
    return responsePromise
  }
}