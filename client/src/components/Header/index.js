import { connect } from 'react-redux'
import { RcAppBar, RcTypography } from '@ringcentral/juno'
import { Toolbar, Button } from '@mui/material'

import { logout } from '../../actions'

import './style.scss'

const Header = ({isLoggedIn, logout}) => {
  return (
    <RcAppBar position="sticky">
      <Toolbar sx={{justifyContent: 'end'}}>
          <Button color="inherit" onClick={logout}>
            <RcTypography variant="body2">Logout</RcTypography>
          </Button>
      </Toolbar>
    </RcAppBar>
  )
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)