import React from 'react';

const renderOptions = (props) => {
  const { options = [], value } = props
  return options.map((option) => {
    return option.value === value 
    ? <option selected value={option.value} key={option.value}>{option.name}</option>
    : <option value={option.value} key={option.value}>{option.name}</option>
  })
}

const Select = ({label, ...props}) => {
  const { errorComponent, yupType, setFieldValue, values = {}, validations, initialValue, ...rest } = props
  const value = values && props.name ? values[props.name] : ''
  return (
    <>
      <label className="rc-label" htmlFor={props.id || props.name}>{label}</label>
      <select className="rc-input select-input" value={value} {...rest}>
        {renderOptions(props)}
      </select>
      {errorComponent}
    </>
  );
}

export default Select;