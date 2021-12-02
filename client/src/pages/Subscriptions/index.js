import { Grid } from '@mui/material'
import { Route, Switch } from 'react-router-dom'

import SubscriptionMenu from '../../components/SubscriptionMenu'
import CreateSubscription from '../CreateSubscription'
import GetSubscriptions from '../GetSubscriptions'
import GetSubscription from '../GetSubscription'
import UpdateSubscription from '../UpdateSubscription'
import CancelSubscription from '../CancelSubscription'

const Subscriptions = () => {
  return (
    <>
      <Grid item lg={1} md={2} className="grid-item">
        <SubscriptionMenu />
      </Grid>
      <Grid item lg={11} md={6} className="grid-item">
        <Switch>
          <Route exact path="/create-subscription" component={CreateSubscription} />
          <Route exact path="/get-subscriptions" component={GetSubscriptions} />
          <Route exact path="/get-subscription" component={GetSubscription} />
          <Route exact path="/update-subscription" component={UpdateSubscription} />
          <Route exact path="/cancel-subscription" component={CancelSubscription} />
        </Switch>
      </Grid>
    </>
  )
}

export default Subscriptions