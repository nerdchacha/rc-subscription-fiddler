import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { RcButton, RcList, RcIconButton, RcAccordion, RcAccordionSummary, RcAccordionDetails, RcTypography } from '@ringcentral/juno'
import { Copy, Remove, Edit, CodeSnippets } from '@ringcentral/juno/icon'
import { push } from 'connected-react-router'

import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { getSubscriptions, subscriptionSetMetadata, cancelSubscription, reopenConsoleTab } from '../../actions'
import { ROUTES } from '../../constants'

import './style.scss'

const GetSubscriptions = ({
  getSubscriptions,
  allSubscriptions,
  generatedSubscriptions,
  cancelSubscription,
  subscriptionSetMetadata,
  push,
  subscriptionMetadata,
  isLoading,
  reopenConsoleTab
}) => {
  useIsLoggedIn()

  const handleCancel = (id) => (e) => {
    e.stopPropagation()
    subscriptionSetMetadata(id, {deleting: true})
    cancelSubscription(id)
  }

  const handleOpenTerminal = (id) => (e) => {
    e.stopPropagation()
    reopenConsoleTab(id)
  }

  const renderSubscriptions = (subscriptions, createdBy) => subscriptions.map((subscription) => {
    const {id} = subscription
    const renderConsoleIcon = createdBy === 'application' ? (
      <RcIconButton
        aria-label="console"
        size="medium"
        title='Open console tab'
        TooltipProps={{placement: 'bottom'}}
        onClick={handleOpenTerminal(id)}
        symbol={CodeSnippets}
      />
    ) : ''
    return (
      <div key={id}>
        <RcAccordion variant="outlined">
            <RcAccordionSummary className="accordian-summary">
              <RcTypography variant="caption2">{id}</RcTypography>
              <div className="icon-container">
                {renderConsoleIcon }
                <RcIconButton
                  aria-label="update"
                  size="medium"
                  title='Update subscription'
                  TooltipProps={{placement: 'bottom'}}
                  onClick={() => push(`${ROUTES.UPDATE_SUBSCRIPTION}/${id}`)}
                  symbol={Edit}
                />
                <RcIconButton
                  aria-label="remove"
                  loading={(subscriptionMetadata[id] || {}).deleting}
                  size="medium"
                  title="Remove subscription"
                  color="danger.b04"
                  TooltipProps={{placement: 'bottom'}}
                  symbol={Remove}
                  onClick={handleCancel(id)}
                />
              </div>
            </RcAccordionSummary>
            <RcAccordionDetails className="accordian-body">
              <pre>
                {JSON.stringify(subscription, null, 2)}
              </pre>
              <RcIconButton
                aria-label="copy"
                size="medium"
                title='copy'
                TooltipProps={{placement: 'bottom'}}
                onClick={() => navigator.clipboard.writeText(JSON.stringify(subscription, null, 2))}
                symbol={Copy}
              />
            </RcAccordionDetails>
          </RcAccordion>
      </div>
    )
  })

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
          <RcTypography variant="title1">Created/Updated by you using this app</RcTypography>
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
  subscriptionMetadata: state.subscription.metadata,
  isLoading: state.metadata.all.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  getSubscriptions: () => dispatch(getSubscriptions()),
  cancelSubscription: (id) => dispatch(cancelSubscription(id)),
  push: (path) => dispatch(push(path)),
  subscriptionSetMetadata: (id, metadata) => dispatch(subscriptionSetMetadata({id, metadata})),
  reopenConsoleTab: (id) => dispatch(reopenConsoleTab(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscriptions)