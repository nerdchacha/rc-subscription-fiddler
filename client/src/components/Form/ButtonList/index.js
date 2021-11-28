import Button from '../../Button'

const ButtonList = ({ items }) => {
  return (
    <div className="button-list-container">
      {items.map((props, i) => <Button {...props} key={i} />)}
    </div>
  )
}

export default ButtonList