const Button = ({ className = '', text, ...rest }) => {
  return <button className={`rc-button ${className}`} {...rest}>{text}</button>
}

export default Button