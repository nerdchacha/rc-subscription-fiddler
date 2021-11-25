import * as yup from 'yup';
import { evaluateJsonLogicOperator } from '../jsonLogic/utils';

const validationSchemaCreator = values => (schema, config) => {
  const { id, yupType, validations = [], dependsOn } = config;
  if (Array.isArray(yupType)) {
    const innerSchema = yupType.reduce(validationSchemaCreator(values), {});
    schema[id] = yup.array().of(innerSchema[yupType[0].id])
  }
  if (!yup[yupType]) {
    return schema;
  }
  const isFieldVisible = evaluateJsonLogicOperator(dependsOn, values);
  // Dont add validation to schema if field is hidden
  if (!isFieldVisible) {
    return schema;
  }
  let validator = yup[yupType]();
  validations.forEach(validation => {
    const { params, type, dependsOn: validationDependsOn = {} } = validation;
    // chain method if validation doesn't depends on anything
    if (!validationDependsOn.fields) {
      validator = validator[type](...params);
      return;
    }
    const showDependingError = evaluateJsonLogicOperator(
      validationDependsOn,
      values,
    );
    // chain method if the condition is true for validation
    if (showDependingError) {
      validator = validator[type](...params);
    }
  });
  schema[id] = validator;
  return schema;
};

export function createYupSchema(data) {
  return yup.lazy(values => {
    const schema = data.reduce(validationSchemaCreator(values), {});
    return yup.object().shape(schema);
  });
}