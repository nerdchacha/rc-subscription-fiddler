import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../../components/Tooltip'
import { logout } from '../../actions'

import './style.scss'

const Header = ({isLoggedIn, logout}) => {
  const renderLogout = isLoggedIn ? (
    <Tooltip title="Logout">
      <span onClick={logout}>
        <FontAwesomeIcon icon={faSignOutAlt} color="white" size="2x" />
      </span>
    </Tooltip>
  ) : ''
  return (
    <header className="rc-header">
      <div className="icon-container">
        {renderLogout}
      </div>
    </header>
  )
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)