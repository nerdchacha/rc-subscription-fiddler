import * as jsonLogic from 'json-logic-js';
import { number, string, boolean, date } from './parsers';

const parserConfig = { number, string, boolean, date };

export function parseValue(value = '', { type, format } = {}) {
  return parserConfig[type] ? parserConfig[type](value, format) : string(value);
}

export function evaluateJsonLogicOperator(dependsOn = {}, values = {}) {
  const { operator = {}, fields = [] } = dependsOn;
  const data = fields.reduce((seed, { name, parser }) => {
    const value = parseValue(values[name], parser);
    seed[name] = value;
    return seed;
  }, {});
  return jsonLogic.apply(operator, data);
}