import { connect } from 'react-redux'
import { Grid } from '@mui/material'

import Form from '../../components/Form'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { cancelSubscription } from '../../actions'

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

const CancelSubscription = ({cancelSubscription, isLoading}) => {
  useIsLoggedIn()

  const handleSubmit = ({ subscriptionId }) => {
    cancelSubscription(subscriptionId)
  }

  const submitButtonProps = {loading: isLoading}
  return (
    <Grid container>
      <Grid item md={12} className="grid-item">
        <Form data={data} submitButtonProps={submitButtonProps} submitButtonText='Cancel Subscription' handleSubmit={handleSubmit} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.metadata.cancel.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  cancelSubscription: (subscriptionId) => dispatch(cancelSubscription(subscriptionId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CancelSubscription)