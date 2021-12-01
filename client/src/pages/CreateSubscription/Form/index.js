import { connect } from 'react-redux'

import Form from '../../../components/Form';
// import subscribe from '../../../subscription';
import { createSubscription } from '../../../actions'

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

const CreateSubscriptionForm = (props) => {
  const handleSubmit = ({eventFilters}) => {
    props.createSubscription({eventFilters})
  }

  return <Form data={data} submitButtonText='Subscribe' handleSubmit={handleSubmit} />
}


const mapDispatchToProps = (dispatch) => ({
  createSubscription: (data) => dispatch(createSubscription(data)),
})

export default connect(null, mapDispatchToProps)(CreateSubscriptionForm)