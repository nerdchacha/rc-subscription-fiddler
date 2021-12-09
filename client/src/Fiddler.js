import { useEffect } from 'react'
import { connect } from 'react-redux';
import { Container } from '@mui/material'
import { Route, Redirect, Switch } from 'react-router-dom'
import { RcLoading } from '@ringcentral/juno'
 
import Header from './components/Header'
import Login from './pages/Login'
import SimpleLogin from './pages/Login/Simple'
import Subscriptions from './pages/Subscriptions'
import { loginUsingAccessToken, reregisterSubscriptionEvents } from './actions'
import { ROUTES } from './constants'

import Console from './components/Console'

const Fiddler = (props) => {
  useEffect(() => {
    props.loginUsingAccessToken()
    props.reregisterSubscriptionEvents()
  }, [])

  return (
    <div className="rc-notification-app">
      <Header />
      <RcLoading loading={props.isLoading} keepMounted>
        <Container maxWidth="xl" space={2} className="container">
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
  isLoading: state.global.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  loginUsingAccessToken: () => dispatch(loginUsingAccessToken()),
  reregisterSubscriptionEvents: () => dispatch(reregisterSubscriptionEvents()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Fiddler)