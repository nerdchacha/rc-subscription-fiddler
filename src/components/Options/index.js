import { connect } from 'react-redux'

import Form from '../Input/Form';
import subscribe from '../../subscription';
import { append, clear } from '../../actions'

const data = [{
  id: 'serverUrl',
  label: 'Server URL*',
  placeholder: 'Enter Server URL',
  initialValue: 'https://platform.devtest.ringcentral.com',
  type: 'text',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['Server URL required'],
    }
  ],
}, {
  id: 'appKey',
  label: 'APP Key*',
  placeholder: 'Enter App Key',
  type: 'text',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['APP Key required'],
    }
  ],
}, {
  id: 'appSecret',
  label: 'APP Secret*',
  placeholder: 'Enter App Secret',
  type: 'text',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['APP Secret required'],
    }
  ],
}, {
  id: 'username',
  label: 'User Name*',
  placeholder: 'Enter Username',
  type: 'text',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['Username required'],
    }
  ],
}, {
  id: 'password',
  label: 'Password*',
  placeholder: 'Enter Password',
  type: 'password',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['Password required'],
    }
  ],
}, {
  id: 'extension',
  label: 'Extension',
  placeholder: 'Enter Extension',
  type: 'text',
  yupType: 'string',
}, {
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
    props.clear()
    subscribe(values, props.append)
  }

  return <Form data={data} submitButtonText='Subscribe' handleSubmit={handleSubmit} />
}

const mapDispatchToProps = (dispatch) => ({
  append: (data) => dispatch(append(data)),
  clear: () => dispatch(clear())
})

export default connect(null, mapDispatchToProps)(Options)