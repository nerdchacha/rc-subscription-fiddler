import React from 'react';

export default function withErrorComponent(InnerComponent) {
  return function WithErrorCopmponent(props) {
    const { error, touched, ...rest } = props;
    const errorComponent = error && touched ? <div className="error">{error}</div> : null;
    return <InnerComponent errorComponent={errorComponent} {...rest} />;
  };
}