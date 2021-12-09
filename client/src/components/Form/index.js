import React from 'react';
import { Formik } from 'formik';
import { RcButton } from '@ringcentral/juno'

import { createYupSchema } from '../Form/yup/schemaCreator';
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
  const { data = [], otherButtons = [], handleSubmit, submitButtonText = 'Submit', hideSubmitButton } = props
  const initialVaues = data.reduce(
    (seed, { id, initialValue = '' }) => Object.assign({}, seed, { [id]: initialValue }),
    {},
  );
  const validationSchema = createValidationSchema(props) 
  const renderSubmitButton = hideSubmitButton ? '' : <RcButton radius='zero' {...props.submitButtonProps} style={{marginTop: 20}} type="submit">{submitButtonText}</RcButton>
  return (
    <Formik
      initialValues={initialVaues}
      validateOnMount
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(actions) => (
        <form onSubmit={actions.handleSubmit}>
          <div className="rc-form">
            {renderFormElements(props, actions)}
            <div className="button-container">
              {renderSubmitButton}
              {otherButtons.map((button, i) => React.cloneElement(button, {key: i}))}
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
};

export default Form