import React from 'react';

const Text = ({label, ...props}) => {
  const { errorComponent, yupType, setFieldValue, values, validations, initialValue, ...rest } = props
  const value = values && props.name ? values[props.name] : ''
  return (
    <>
      <label className="rc-label" htmlFor={props.id || props.name}>{label}</label>
      <input className="rc-input text-input" value={value} {...rest} />
      {errorComponent}
    </>
  );
}

export default Text;