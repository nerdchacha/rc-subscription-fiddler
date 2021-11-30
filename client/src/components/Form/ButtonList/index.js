import { RcButton } from '@ringcentral/juno'

const ButtonList = ({ items }) => {
  return (
    <div className="button-list-container">
      {items.map(({text, ...rest}, i) => <RcButton {...rest} key={i}>{text}</RcButton>)}
    </div>
  )
}

export default ButtonList