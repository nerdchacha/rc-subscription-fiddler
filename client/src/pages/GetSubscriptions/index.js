import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { RcButton, RcList, RcTypography } from '@ringcentral/juno'

import SubscriptionItem from '../../components/SubscriptionItem'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { getSubscriptions } from '../../actions'

import './style.scss'

const GetSubscriptions = ({
  getSubscriptions,
  allSubscriptions,
  generatedSubscriptions,
  isLoading,
}) => {
  useIsLoggedIn()

  const renderSubscriptions = (subscriptions, createdBy) => subscriptions.map((subscription) => (
    <SubscriptionItem subscription={subscription} createdBy={createdBy} key={subscription.id} />
  ))

  const filteredGeneratedSubscriptions = Object.keys(allSubscriptions).reduce((seed, id) => {
    if (generatedSubscriptions.hasOwnProperty(id)) { seed.push(allSubscriptions[id]) }
    return seed;
  }, [])
  const filteredNonGeneratedSubscriptions = Object.keys(allSubscriptions).reduce((seed, id) => {
    if (!generatedSubscriptions.hasOwnProperty(id)) { seed.push(allSubscriptions[id]) }
    return seed;
  }, [])

  const renderGeneratedSubscriptions =  Object.keys(filteredGeneratedSubscriptions).length ? 
    renderSubscriptions(filteredGeneratedSubscriptions, 'application') :
    'No data available'

  const renderNonGeneratedSubscriptions = Object.keys(filteredNonGeneratedSubscriptions).length ? 
    renderSubscriptions(filteredNonGeneratedSubscriptions, 'other') :
    'No data available'

  return (
    <Grid container>
      <Grid item md={12} sm={12} className="grid-item">
        <RcButton className="get-subscriptions-button" radius="zero" onClick={getSubscriptions} loading={isLoading}>Get subscriptions</RcButton>
        <RcList className="subscription-container">
        <div>
          <RcTypography variant="title1">PubNub subscriptions created/updated by you using this app</RcTypography>
          {renderGeneratedSubscriptions}
        </div>
        <div>
          <RcTypography variant="title1">Other subscriptions</RcTypography>
          {renderNonGeneratedSubscriptions}
        </div>
        </RcList>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  allSubscriptions: state.subscription.all,
  generatedSubscriptions: state.subscription.application,
  isLoading: state.metadata.all.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  getSubscriptions: () => dispatch(getSubscriptions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscriptions)