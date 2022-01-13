import { RcAlert } from '@ringcentral/juno'

import Form from '../../../components/Form';

const alertComponent = (
  <RcAlert className="event-filter-alert" severity="warning">
    <p>
      List of available event filters can be found <a target="_blank" rel="noreferrer" href="https://developers.ringcentral.com/api-reference/events-notifications">here</a> under the "Notifications Types" sectopn</p>
  </RcAlert>
)

const data = [{
  id: 'loginTypeAlert',
  type: 'passThrough',
  component: alertComponent,
}, {
  id: 'eventFilters',
  label: 'Event Filters*',
  type: 'textArray',
  initialValue: [''],
  placeholder: '/restapi/v1.0/account/~/telephony/sessions',
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
  initialValue: 'PubNub',
  yupType: 'string',
  options: [{name: 'PubNub', value: 'PubNub'}, {name: 'Webhook', value: 'WebHook'}],
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
      '===': ['WebHook', { var: 'transportType' }]
    }
  }, 
  validations: [
    {
      type: 'required',
      params: ['Webhook URL required'],
    }
  ],
}, {
  id: 'verificationToken',
  label: 'Verification Token',
  placeholder: 'Enter verification token',
  type: 'text',
  yupType: 'string',
  dependsOn: {
    fields: [
      { name: 'transportType', parser: { type: 'string' } }
    ],
    operator: {
      '===': ['WebHook', { var: 'transportType' }]
    }
  }, 
}]

const CreateSubscriptionForm = ({handleSubmit, submitButtonProps}) => {
  return <Form data={data} submitButtonText='Subscribe' submitButtonProps={submitButtonProps} handleSubmit={handleSubmit} />
}

export default CreateSubscriptionForm