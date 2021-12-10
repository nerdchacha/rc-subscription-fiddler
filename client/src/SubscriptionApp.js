import { useEffect } from 'react'
import { connect } from 'react-redux';
import { Container } from '@mui/material'
import { Route, Redirect, Switch } from 'react-router-dom'
import { RcLoading } from '@ringcentral/juno'
 
import Header from './components/Header'
import Login from './pages/Login'
import SimpleLogin from './pages/Login/Simple'
import Subscriptions from './pages/Subscriptions'
import { loginUsingAccessToken } from './actions'
import { ROUTES } from './constants'
import useNotification from './hooks/useNotification'


import Console from './components/Console'

const Fiddler = ({isLoading, consoleHeight, loginUsingAccessToken}) => {
  useEffect(() => loginUsingAccessToken(), [])

  useNotification()

  return (
    <div className="rc-notification-app">
      <Header />
      <RcLoading loading={isLoading} keepMounted>
        <Container maxWidth="xl" space={2} className="container" style={{height: `calc(100vh - 56px - ${consoleHeight}px)`}}>
          <Switch>
            <Route exact path={ROUTES.LOGIN} component={Login} />
            <Route exact path={ROUTES.SIMPLE_LOGIN} component={SimpleLogin} />
            <Route path="/" component={Subscriptions} />
            <Redirect to={ROUTES.GET_SUBSCRIPTIONS} />
          </Switch>
        </Container>
        <Console />
      </RcLoading>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.global.isLoading,
  consoleHeight: state.console.metadata.height
})

const mapDispatchToProps = (dispatch) => ({
  loginUsingAccessToken: () => dispatch(loginUsingAccessToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Fiddler)