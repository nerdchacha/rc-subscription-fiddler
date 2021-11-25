import React from 'react';
import { useField } from 'formik';

const renderOptions = (props) => {
  const { options = [], value } = props
  return options.map((option) => {
    return option.value === value 
    ? <option selected value={option.value} key={option.value}>{option.name}</option>
    : <option value={option.value} key={option.value}>{option.name}</option>
  })
}

const Select = ({label, ...props}) => {
  const [field, meta] = useField(props);
  const { errorComponent, yupType, setFieldValue, values, validations, initialValue, ...rest } = props
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select className="select-input" {...field} {...rest}>
        {renderOptions(props)}
      </select>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
}

export default Select;