import React from 'react';

export default function withErrorComponent(InnerComponent) {
  return function WithErrorCopmponent(props) {
    const { error, touched, ...rest } = props;
    const errorComponent = error && touched ? <strong>{error}</strong> : null;
    return <InnerComponent errorComponent={errorComponent} {...rest} />;
  };
}