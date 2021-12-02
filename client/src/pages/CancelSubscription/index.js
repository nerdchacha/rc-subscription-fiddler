import { connect } from 'react-redux'
import { Grid } from '@mui/material'

import Form from '../../components/Form'
import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { clearConsole, cancelSubscription } from '../../actions'

const data = [{
  id: 'subscriptionId',
  label: 'Subscription Id*',
  type: 'text',
  yupType: 'string',
  validations: [
    {
      type: 'required',
      params: ['Subscription Id is required'],
    }
  ]
}]

const CancelSubscription = ({consoleData, cancelSubscription, clearConsole}) => {
  useIsLoggedIn()

  const handleSubmit = ({ subscriptionId }) => {
    cancelSubscription(subscriptionId)
  }

  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <Form data={data} submitButtonText='Cancel Subscription' handleSubmit={handleSubmit} />
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal data={consoleData} clearConsole={clearConsole} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  consoleData: state.console.cancelSubscription.data
})

const mapDispatchToProps = (dispatch) => ({
  clearConsole: () => dispatch(clearConsole('cancelSubscriptions')),
  cancelSubscription: (subscriptionId) => dispatch(cancelSubscription(subscriptionId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CancelSubscription)