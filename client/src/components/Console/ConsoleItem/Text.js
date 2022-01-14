const Text  = ({className, text, isCode}) => {
  return isCode ? <pre>{text}</pre> : (
    <p className={className}>
      {text}
    </p>
    )
}

export default Text