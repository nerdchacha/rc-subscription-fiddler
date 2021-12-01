import React from 'react';

import { evaluateJsonLogicOperator } from '../Form/jsonLogic/utils';

export default function withShowElementComponent(InnerComponent) {
  return function WithShowElementComponent(props) {
    const { dependsOn, values, ...rest } = props;
    const showElement = evaluateJsonLogicOperator(dependsOn, values);
    return showElement ? <InnerComponent values={values} {...rest} /> : null;
  };
}