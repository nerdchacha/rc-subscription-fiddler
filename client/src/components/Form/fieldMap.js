import Text from '../Input/Text';
import Select from '../Input/Select';
import TextArray from './TextArray'
import ButtonList from './ButtonList'
import PassThrough from './PassThrough'

import withErrorComponent from '../HOC/withErrorComponent';
import withShowElement from '../HOC/withShowElement';
import { compose } from '../../utils';

const withShowElementAndErrorComponent = compose(
  withShowElement,
  withErrorComponent
);

const typeMap = {
  text: withShowElementAndErrorComponent(Text),
  number: withShowElementAndErrorComponent(Text),
  password: withShowElementAndErrorComponent(Text),
  select: withShowElementAndErrorComponent(Select),
  textArray: TextArray,
  buttonList: withShowElement(ButtonList),
  passThrough: withShowElement(PassThrough),
};

export default typeMap