export const append = (text, canCopy) => ({type: 'append', data: {text, canCopy}})
export const clear = () => ({type: 'clear'})