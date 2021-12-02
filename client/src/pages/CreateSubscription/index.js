import { connect } from 'react-redux'
import { Grid } from '@mui/material'

import Form from './Form'
import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { clearConsole, createSubscription } from '../../actions'

import './style.scss'


const CreateSubscriptions = ({consoleData, clearConsole, createSubscription}) => {
  // TODO: Make a privte route component and use it in there
  useIsLoggedIn()
  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <Form handleSubmit={createSubscription}/>
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal data={consoleData} clearConsole={clearConsole} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  consoleData: state.console.createSubscription.data
})

const mapDispatchToProps = (dispatch) => ({
  clearConsole: () => dispatch(clearConsole('createSubscription')),
  createSubscription: (data) => dispatch(createSubscription(data)),

})

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubscriptions)