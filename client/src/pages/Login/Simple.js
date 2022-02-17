import { connect } from 'react-redux'
import { RcCard, RcCardContent, RcAlert } from '@ringcentral/juno'

import Form from '../../components/Form'
import { setLoginDetails, login } from '../../actions'

import './style.scss'

const SimpleLogin = (props) => {
  const alertComponent = (
    <RcAlert className="login-type-alert" severity="warning">
      <p>We recommend using the 3 legged auth flow instead of password based login</p>
    </RcAlert>
  )

  const formData = [{
    id: 'loginTypeAlert',
    type: 'passThrough',
    component: alertComponent,
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
    id: 'clientId',
    label: 'Client Id*',
    placeholder: 'Enter Client Id',
    type: 'text',
    yupType: 'string',
    validations: [
      {
        type: 'required',
        params: ['Client Id required'],
      }
    ],
  }, {
    id: 'clientSecret',
    label: 'Client Secret*',
    placeholder: 'Enter Client Secret',
    type: 'text',
    yupType: 'string',
    validations: [
      {
        type: 'required',
        params: ['Client Secret required'],
      }
    ],
  }, {
    id: 'buttonList',
    type: 'buttonList',
    items: [{
      type: 'submit',
      className: 'primary',
      text: 'Login',
      radius: 'zero'
    }]
  }]

  const handleSubmit = ({ serverUrl, clientId, clientSecret, username, password, extension }) => {
    props.setLoginDetails({ serverUrl, clientId, clientSecret, loginType: 'password', username, password, extension })
    props.login()
  }

  const savedState = props.loginDetails
  formData.forEach((item) => {
    if (!savedState[item.id]) { return }
    item.initialValue = savedState[item.id]
  })

  return (
    <>
       <RcCard classes={{root: "login-card-container"}} style={{width: 600}}>
         <RcCardContent>
          <Form data={formData} handleSubmit={handleSubmit} hideSubmitButton></Form>
        </RcCardContent>
      </RcCard>
    </>
  )
}

const mapStateToProps  = (state) => ({
  loginDetails: state.auth.loginDetails.password
})

const mapDispatchToProps = (dispatch) => ({
  setLoginDetails: (details) => dispatch(setLoginDetails(details, 'password')),
  login: () => (dispatch(login('password')))
})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLogin)