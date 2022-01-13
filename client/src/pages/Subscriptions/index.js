import { Grid } from '@mui/material'
import { Route, Switch, Redirect } from 'react-router-dom'

import SubscriptionMenu from '../../components/SubscriptionMenu'
import CreateSubscription from '../CreateSubscription'
import GetSubscriptions from '../GetSubscriptions'
import GetSubscription from '../GetSubscription'
import UpdateSubscription from '../UpdateSubscription'
import CancelSubscription from '../CancelSubscription'
import Resources from '../Resources'
import { ROUTES } from '../../constants'

const Subscriptions = () => {
  return (
    <>
      <Grid item lg={1} md={2} className="grid-item">
        <SubscriptionMenu />
      </Grid>
      <Grid item lg={11} md={10} className="grid-item">
        <Switch>
          <Route exact path={ROUTES.CREATE_SUBSCRIPTION} component={CreateSubscription} />
          <Route exact path={ROUTES.GET_SUBSCRIPTIONS} component={GetSubscriptions} />
          <Route exact path={ROUTES.GET_SUBSCRIPTION} component={GetSubscription} />
          <Route path={`${ROUTES.UPDATE_SUBSCRIPTION}/:id?`} component={UpdateSubscription} />
          <Route exact path={ROUTES.CANCEL_SUBSCRIPTION} component={CancelSubscription} />
          <Route exact path={ROUTES.RESOURCES} component={Resources} />
          <Redirect to={ROUTES.GET_SUBSCRIPTIONS} />
        </Switch>
      </Grid>
    </>
  )
}

export default Subscriptions