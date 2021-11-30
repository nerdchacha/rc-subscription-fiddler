import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { RcButton } from '@ringcentral/juno'

import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { clearConsole, getSubscriptions } from '../../actions'

const GetSubscriptions = ({consoleData, getSubscriptions, clearConsole}) => {
  useIsLoggedIn()
  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <RcButton radius="zero" onClick={getSubscriptions}>Get subscriptions</RcButton>
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal data={consoleData} clearConsole={clearConsole} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  consoleData: state.console.getSubscriptions.data
})

const mapDispatchToProps = (dispatch) => ({
  clearConsole: () => dispatch(clearConsole('getSubscriptions')),
  getSubscriptions: () => dispatch(getSubscriptions())
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscriptions)