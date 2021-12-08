import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { RcButton, RcList, RcIconButton, RcListItem, RcListItemText, RcListItemSecondaryAction } from '@ringcentral/juno'
import { Info, Remove, Warning } from '@ringcentral/juno/icon'

import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { clearConsole, getSubscriptions, cancelSubscriptionAndGetAllSubscriptions } from '../../actions'

import './style.scss'

const GetSubscriptions = ({consoleData, getSubscriptions, clearConsole, allSubscriptions, generatedSubscriptions, cancelSubscription}) => {
  useIsLoggedIn()

  const renderAllSubscriptions = Object.keys(allSubscriptions).map((id) => {
    const createdUsingApp = generatedSubscriptions.hasOwnProperty(id) 
    const renderInfoIcon = generatedSubscriptions.hasOwnProperty(id) ? (
      <RcIconButton
        aria-label="info"
        size="medium"
        color={'action.grayDark'}
        title="This subscription was created using this app"
        TooltipProps={{placement: 'bottom'}}
        symbol={Info}
      />
    ) : ''
    return (
      <RcListItem disableGutters divider canHover={false} key={id}>
        <RcListItemText primaryTypographyProps={{variant: 'body1'}} primary={id} />
        <RcListItemSecondaryAction>
          <RcIconButton
            aria-label="info"
            size="medium"
            color={createdUsingApp ? 'action.grayDark' : 'warning.b03'}
            title={createdUsingApp ? 'This subscription was created using this app' : 'This subscription was NOT created using this app'}
            TooltipProps={{placement: 'bottom'}}
            symbol={createdUsingApp ? Info : Warning}
          />
          <RcIconButton
            aria-label="remove"
            size="medium"
            title="Remove subscription"
            color="danger.b04"
            TooltipProps={{placement: 'bottom'}}
            symbol={Remove}
            onClick={() => cancelSubscription(id)}
          />
        </RcListItemSecondaryAction>
      </RcListItem>
    )
  })

  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <RcButton radius="zero" onClick={getSubscriptions}>Get subscriptions</RcButton>
        <RcList className="subscription-container">
          {renderAllSubscriptions}
        </RcList>
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal data={consoleData} clearConsole={clearConsole} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  consoleData: state.console.getSubscriptions.data,
  allSubscriptions: state.subscription.all,
  generatedSubscriptions: state.subscription.generated,
})

const mapDispatchToProps = (dispatch) => ({
  clearConsole: () => dispatch(clearConsole('getSubscriptions')),
  getSubscriptions: () => dispatch(getSubscriptions()),
  cancelSubscription: (id) => dispatch(cancelSubscriptionAndGetAllSubscriptions(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscriptions)