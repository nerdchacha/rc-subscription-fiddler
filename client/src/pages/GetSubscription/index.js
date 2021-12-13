import { connect } from 'react-redux'
import { Grid } from '@mui/material'

import Form from '../../components/Form'
import SubscriptionItem from '../../components/SubscriptionItem'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { getSubscription } from '../../actions'

import './style.scss'

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

const GetSubscription = ({subscription, applicationSubscriptions, getSubscription, isLoading}) => {
  useIsLoggedIn()

  const handleSubmit = ({ subscriptionId }) => {
    getSubscription(subscriptionId)
  }

  const renderSubscriptions = () => {
    if (!subscription.id) { return '' }
    const createdBy = Object.keys(applicationSubscriptions).includes(subscription.id) ? 'application' : 'all'
    return <SubscriptionItem subscription={subscription} createdBy={createdBy} />
  }

  const submitButtonProps = {loading: isLoading}

  return (
    <Grid container>
      <Grid item md={12} className="grid-item">
        <Form data={data} submitButtonProps={submitButtonProps} submitButtonText='Get Subscription' handleSubmit={handleSubmit} />
        <div className="subscription-container">
          {renderSubscriptions()}
        </div>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  subscription: state.subscription.individual,
  isLoading: state.metadata.get.isLoading,
  applicationSubscriptions: state.subscription.application,
})

const mapDispatchToProps = (dispatch) => ({
  getSubscription: (subscriptionId) => dispatch(getSubscription(subscriptionId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscription)