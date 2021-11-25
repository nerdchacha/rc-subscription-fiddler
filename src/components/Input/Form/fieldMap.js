import Text from '../Text';
import Select from '../Select';
import TextArray from '../TextArray'

import withErrorComponent from '../../HOC/withErrorComponent';
import withShowElement from '../../HOC/withShowElement';
import { compose } from '../../../utils';

const withShowElementAndErrorComponent = compose(
  withShowElement,
  withErrorComponent
);

const typeMap = {
  text: withShowElementAndErrorComponent(Text),
  password: withShowElementAndErrorComponent(Text),
  select: withShowElementAndErrorComponent(Select),
  textArray: TextArray,
};

export default typeMap