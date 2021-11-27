import { connect } from 'react-redux'

import Form from '../Input/Form';
import Modal from '../Modal'
import { closeConfigurationModal, setConfigurationData } from '../../actions'

import './style.scss'

const data = [{
  id: 'serverUrl',
  label: 'Environment*',
  placeholder: 'Enter Server URL',
  initialValue: 'https://platform.devtest.ringcentral.com',
  options: [{name: 'Sandbox', value: 'https://platform.devtest.ringcentral.com'}, {name: 'Production', value: 'https://platform.ringcentral.com'}],  
  type: 'select',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['Server URL required'],
    }
  ],
}, {
  id: 'appKey',
  label: 'App Key*',
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
  label: 'App Secret*',
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
}]

const Configuration = (props) => {
  const handleSubmit = (values) => {
    props.closeConfigurationModal()
    props.setConfigurationData(values)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    props.closeConfigurationModal()
  }

  const populateInitialValueFromStore = (data) => {
    const populatedData = JSON.parse(JSON.stringify(data))
    const storeData = props.configurationData
    Object.keys(storeData).forEach((key) => {
      if (storeData[key] !== '') {
        populatedData.find(({id}) => id === key).initialValue = storeData[key]
      }
    })
    return populatedData
  }

  const cancelButton = <button className="rc-button secondary" onClick={handleCancel}>Cancel</button>
  const otherButtons = [cancelButton]

  return (
    <Modal open={props.showConfigurationModal} title="Configuration">
      <div className="rc-configuration-container">
        <Form data={populateInitialValueFromStore(data)} submitButtonText='Save' handleSubmit={handleSubmit} otherButtons={otherButtons} />
      </div>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  showConfigurationModal: state.configuration.showModal,
  configurationData: state.configuration.data,
})

const mapDispatchToProps = (dispatch) => ({
  setConfigurationData: (data) => dispatch(setConfigurationData(data)),
  closeConfigurationModal: () => dispatch(closeConfigurationModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Configuration)