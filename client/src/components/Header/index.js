import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../../components/Tooltip'
import { openConfigurationModal } from '../../actions'

import './style.scss'

const Header = (props) => {

  const openConfiguration = () => {
    props.openConfigurationModal()
  }

  return (
    <header className="rc-header">
      <div className="icon-container">
        {/* TODO: remove */}
        {/* <Tooltip title="Open configuration">
          <span onClick={openConfiguration}>
            <FontAwesomeIcon icon={faCogs} color="white" size="2x" />
          </span>
        </Tooltip> */}
      </div>
    </header>
  )
}

const mapDispatchToProps = (dispatch) => ({
  openConfigurationModal: () => dispatch(openConfigurationModal())
})

export default connect(null, mapDispatchToProps)(Header)