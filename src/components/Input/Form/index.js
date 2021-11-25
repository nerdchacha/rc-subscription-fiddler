import React from 'react';
import { Formik } from 'formik';

import { createYupSchema } from '../../../yup/schemaCreator';
import fieldMap from './fieldMap';

import './style.scss'

const createValidationSchema = (props) => createYupSchema(props.data);

const renderFormElements = (props, actions) => {
  return props.data.map(item => {
    const Component = fieldMap[item.type];
    const {
      errors,
      values,
      handleChange,
      handleBlur,
      setFieldValue,
      touched,
    } = actions;
    let error = errors[item.id] || null;
    return item.type ? (
      <Component
        {...item}
        key={item.id}
        values={values}
        name={item.id}
        onChange={handleChange}
        error={error}
        setFieldValue={setFieldValue}
        touched={touched[item.id]}
        onBlur={handleBlur}
      />
    ) : null;
  });
}

const Form = (props) => {
  const initialVaues = props.data.reduce(
    (seed, { id, initialValue = '' }) => Object.assign({}, seed, { [id]: initialValue }),
    {},
  );
  const validationSchema = createValidationSchema(props)
  return (
    <Formik
      initialValues={initialVaues}
      validateOnMount
      validationSchema={validationSchema}
      onSubmit={(values) => props.handleSubmit(values)}
    >
      {(actions) => (
        <form onSubmit={actions.handleSubmit}>
          <div className="ringcentral-form">
            {renderFormElements(props, actions)}
          <button className="rc-button primary" type="submit">{props.submitButtonText || 'Submit'}</button>
          </div>
        </form>
      )}
    </Formik>
  )
};

export default Form