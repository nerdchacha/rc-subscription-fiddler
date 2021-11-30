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
        <li><strong>REDIRECT_URI</strong> that strictly matches this one <strong>{`${process.env.REACT_APP_SERVER_BASE_URL}/redirect.html`}</strong></li>
      </ol>
    </RcAlert>
  )

  const formData = [{
    id: 'loginType',
    label: 'Login Type*',
    type: 'select',
    yupType: 'string',
    initialValue: '3LeggedLogin',
    options: [{name: 'Password Flow', value: 'password'}, {name: '3 Legged Login', value: '3LeggedLogin'}],
    validations: [
      {
        type: 'required',
        params: ['Transport Type is required'],
      }
    ],
  }, {
    id: 'loginTypeAlert',
    type: 'passThrough',
    component: alertComponent,
    dependsOn: {
      fields: [
        { name: 'loginType', parser: { type: 'string' } }
      ],
      operator: {
        '===': ['3LeggedLogin', { var: 'loginType' }]
      }
    },
  }, {
    id: 'username',
    label: 'User Name*',
    placeholder: 'Enter Username',
    type: 'text',
    yupType: 'string',
    dependsOn: {
      fields: [
        { name: 'loginType', parser: { type: 'string' } }
      ],
      operator: {
        '===': ['password', { var: 'loginType' }]
      }
    },
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
    dependsOn: {
      fields: [
        { name: 'loginType', parser: { type: 'string' } }
      ],
      operator: {
        '===': ['password', { var: 'loginType' }]
      }
    },
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
    dependsOn: {
      fields: [
        { name: 'loginType', parser: { type: 'string' } }
      ],
      operator: {
        '===': ['password', { var: 'loginType' }]
      }
    },
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

  const handleSubmit = ({ serverUrl, appKey, appSecret, loginType, username, password, extension }) => {
    props.setLoginDetails({ serverUrl, appKey, appSecret, loginType, username, password, extension })
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
  loginDetails: state.auth.loginDetails
})

const mapDispatchToProps = (dispatch) => ({
  setLoginDetails: (details) => dispatch(setLoginDetails(details)),
  login: () => (dispatch(login()))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)