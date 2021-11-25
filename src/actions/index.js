export const appendToConsole = (text, canCopy) => ({type: 'append', data: {text, canCopy}})
export const clearConsole = () => ({type: 'clear'})
export const openConfigurationModal = () => ({type: 'showModal', showModal: true})
export const closeConfigurationModal = () => ({type: 'showModal', showModal: false})
export const setConfigurationData = (data) => ({type: 'setConfiguration', data})