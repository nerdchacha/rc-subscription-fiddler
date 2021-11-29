import { useEffect } from 'react'
import { connect } from 'react-redux';
import { Container } from '@mui/material'
import { Route } from 'react-router-dom'
 
import Header from './components/Header'
import Configuration from './components/Configuration'
import Login from './pages/Login'
import Notifications from './pages/Notifications'
import { relogin } from './actions'

const Fiddler = (props) => {
  useEffect(() => {
    props.relogin()
  }, [])

  return (
    <div className="rc-notification-app">
      <Header />
      <Container maxWidth="xl" space={2} className="container">
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Notifications} />
        <Configuration />
      </Container>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  relogin: () => dispatch(relogin()),
})

export default connect(null, mapDispatchToProps)(Fiddler)