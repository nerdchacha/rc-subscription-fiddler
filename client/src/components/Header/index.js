import { connect } from 'react-redux'
import { RcAppBar, RcTypography } from '@ringcentral/juno'
import { Toolbar, Button } from '@mui/material'
import { push } from 'connected-react-router'
import { useLocation } from 'react-router-dom'

import { logout } from '../../actions'
import { ROUTES } from '../../constants'

import './style.scss'

const Header = ({isLoggedIn, logout, push}) => {
  const { pathname } = useLocation();
  const renderLogoutButton = isLoggedIn ? (
    <Button color="inherit" onClick={logout}>
      <RcTypography variant="caption2">Logout</RcTypography>
    </Button>
  ) : ''
  const renderSimpleLoginButton = !isLoggedIn && pathname === ROUTES.LOGIN ? (
    <Button color="inherit" onClick={() => push(ROUTES.SIMPLE_LOGIN)}>
      <RcTypography variant="caption2">Simple Login</RcTypography>
    </Button>
  ) : ''
  const render3LeggedLoginButton = !isLoggedIn && pathname === ROUTES.SIMPLE_LOGIN ? (
    <Button color="inherit" onClick={() => push(ROUTES.LOGIN)}>
      <RcTypography variant="caption2">3 Legged Login</RcTypography>
    </Button>
  ) : ''
  return (
    <RcAppBar position="sticky">
      <Toolbar sx={{justifyContent: 'end'}}>
          {renderLogoutButton}
          {renderSimpleLoginButton}
          {render3LeggedLoginButton}
      </Toolbar>
    </RcAppBar>
  )
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  push: (route) => dispatch(push(route))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)