import React from 'react';
import { useField } from 'formik';

const Text = ({label, ...props}) => {
  const { errorComponent, yupType, setFieldValue, values, validations, initialValue, ...rest } = props
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...rest} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
}

export default Text;