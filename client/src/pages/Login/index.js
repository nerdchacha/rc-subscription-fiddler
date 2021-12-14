import { connect } from 'react-redux'
import { RcCard, RcCardContent, RcAlert } from '@ringcentral/juno'

import Form from '../../components/Form'
import { setLoginDetails, login } from '../../actions'

import './style.scss'

const Login = (props) => {
  const alertComponent = (
    <RcAlert className="login-type-alert" severity="warning">
    <p>In order to use this demo your application must have:</p>
      <ol>
        <li>Appropriate <strong>GRANT_TYPE</strong> permissions</li>
        <li><strong>REDIRECT_URI</strong> that strictly matches this one <strong>{`${window.location.origin}/redirect.html`}</strong></li>
      </ol>
    </RcAlert>
  )

  const formData = [{
    id: 'loginTypeAlert',
    type: 'passThrough',
    component: alertComponent,
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
    id: 'appKey',
    label: 'App Key*',
    placeholder: 'Enter App Key',
    type: 'text',
    yupType: 'string',
    validations: [
      {
        type: 'required',
        params: ['App Key required'],
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
        params: ['App Secret required'],
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

  const handleSubmit = ({ serverUrl, appKey, appSecret, username, password, extension }) => {
    props.setLoginDetails({ serverUrl, appKey, appSecret, loginType: '3LeggedLogin', username, password, extension })
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
  loginDetails: state.auth.loginDetails['3LeggedLogin']
})

const mapDispatchToProps = (dispatch) => ({
  setLoginDetails: (details) => dispatch(setLoginDetails(details, '3LeggedLogin')),
  login: () => (dispatch(login('3LeggedLogin')))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)