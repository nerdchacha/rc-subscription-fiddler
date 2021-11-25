import { connect } from 'react-redux'

import Form from '../Input/Form';
import subscribe from '../../subscription';
import { appendToConsole, clearConsole, openConfigurationModal } from '../../actions'

const data = [{
  id: 'eventFilters',
  label: 'Event Filters*',
  type: 'textArray',
  initialValue: [''],
  yupType: [{
    id: 'eventFilter',
    yupType: 'string',
    validations: [
      {
        type: 'required',
        params: ['Event Filter is required'],
      }
    ]
  }]
}, {
  id: 'transportType',
  label: 'Transport Type*',
  type: 'select',
  initialValue: 'pubnub',
  yupType: 'string',
  options: [{name: 'PubNub', value: 'pubnub'}, {name: 'Webhook', value: 'webhook'}],
  validations: [
    {
      type: 'required',
      params: ['Transport Type is required'],
    }
  ],
}, {
  id: 'webHookUrl',
  label: 'Web Hook URL*',
  placeholder: 'Enter web Hook URL',
  type: 'text',
  yupType: 'string',
  dependsOn: {
    fields: [
      { name: 'transportType', parser: { type: 'string' } }
    ],
    operator: {
      '===': ['webhook', { var: 'transportType' }]
    }
  }, 
  validations: [
    {
      type: 'required',
      params: ['Webhook URL required'],
    }
  ],
}]

const Options = (props) => {
  const handleSubmit = (values) => {
    if (!Object.keys(props.configurationData).length) {
      props.openConfigurationModal();
      return
    }
    props.clearConsole()
    subscribe({...props.configurationData, ...values}, props.appendToConsole)
  }

  return <Form data={data} submitButtonText='Subscribe' handleSubmit={handleSubmit} />
}

const mapStateToProps = (state) => ({
  configurationData: state.configuration.data,
})


const mapDispatchToProps = (dispatch) => ({
  openConfigurationModal: () => dispatch(openConfigurationModal()),
  appendToConsole: ({text, canCopy = false}) => dispatch(appendToConsole(text, canCopy)),
  clearConsole: () => dispatch(clearConsole())
})

export default connect(mapStateToProps, mapDispatchToProps)(Options)