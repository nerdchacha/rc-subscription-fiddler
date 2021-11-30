import { useEffect } from 'react'
import { connect } from 'react-redux';
import { Container } from '@mui/material'
import { Route } from 'react-router-dom'
import { RcLoading } from '@ringcentral/juno'
 
import Header from './components/Header'
import Login from './pages/Login'
import Subscriptions from './pages/Subscriptions'
import { loginUsingAccessToken } from './actions'

const Fiddler = (props) => {
  useEffect(() => { props.loginUsingAccessToken() }, [])

  return (
    <div className="rc-notification-app">
      <Header />
      <RcLoading loading={props.isLoading} keepMounted>
        <Container maxWidth="xl" space={2} className="container">
        <Route exact path="/login" component={Login} />
        <Route path="/" component={Subscriptions} />
        </Container>
      </RcLoading>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.global.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  loginUsingAccessToken: () => dispatch(loginUsingAccessToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Fiddler)