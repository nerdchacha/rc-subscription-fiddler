import { useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RcIconButton, RcAccordion, RcAccordionSummary, RcAccordionDetails, RcTypography, RcDialog, RcDialogTitle, RcDialogContentText, RcDialogActions, RcButton  } from '@ringcentral/juno'
import { Copy, Delete, Edit, CodeSnippets } from '@ringcentral/juno/icon'
import { Container } from '@mui/material'

import { cancelSubscription, reopenConsoleTab, subscriptionSetMetadata } from '../../actions'
import { ROUTES } from '../../constants'

import './style.scss'

const SubscriptionItem = ({subscription, createdBy, subscriptionMetadata, push, reopenConsoleTab, cancelSubscription, subscriptionSetMetadata}) => {

  const [subscriptionIdToDelete, setSubscriptionIdToDelete] = useState('')
  const [dialogState, toggleDialogState] = useState(false)

  const handleDialogOpen = (id) => (e) => {
    e.stopPropagation()
    setSubscriptionIdToDelete(id)
    toggleDialogState(true)
  }

  const handleOpenTerminal = (id) => (e) => {
    e.stopPropagation()
    reopenConsoleTab(id)
  }

  const handleCancel = () => {
    toggleDialogState(false)
    subscriptionSetMetadata(subscriptionIdToDelete, {deleting: true})
    cancelSubscription(subscriptionIdToDelete)
  }

  const handleCopyId = (id) => (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
  }

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
    <div key={id} className="subscription-item-container">
      <RcDialog open={dialogState}>
        <RcDialogTitle>{`Remove subscription ${subscriptionIdToDelete}`}</RcDialogTitle>
        <Container>
          <RcDialogContentText>
            Are you sure you want to remove this subscription?
          </RcDialogContentText>
          <RcDialogContentText>
            This will delete the subscription permanently
          </RcDialogContentText>
          <RcDialogActions>
            <RcButton variant="outlined" onClick={() => toggleDialogState(false)}>Cancel</RcButton>
            <RcButton variant="contained" color="avatar.tomato" onClick={() => handleCancel()}>Delete</RcButton>
          </RcDialogActions>
        </Container>
      </RcDialog>
      <RcAccordion variant="outlined">
          <RcAccordionSummary className="accordian-summary">
            <RcTypography variant="caption2">{id}</RcTypography>
            <div className="icon-container">
              {renderConsoleIcon }
              <RcIconButton
                aria-label="copy-id"
                size="medium"
                title='copy subscription id'
                TooltipProps={{placement: 'bottom'}}
                onClick={handleCopyId(id)}
                symbol={Copy}
              />
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
                symbol={Delete}
                onClick={handleDialogOpen(id)}
              />
            </div>
          </RcAccordionSummary>
          <RcAccordionDetails className="accordian-body">
            <RcIconButton
              aria-label="copy"
              size="medium"
              title='copy details'
              TooltipProps={{placement: 'bottom'}}
              onClick={() => navigator.clipboard.writeText(JSON.stringify(subscription, null, 2))}
              symbol={Copy}
            />
            <pre>
              {JSON.stringify(subscription, null, 2)}
            </pre>
          </RcAccordionDetails>
        </RcAccordion>
    </div>
  )
}

const mapStateToProps = (state) => ({
  subscriptionMetadata: state.subscription.metadata,
})

const mapDispatchToProps = (dispatch) => ({
  cancelSubscription: (id) => dispatch(cancelSubscription(id)),
  push: (path) => dispatch(push(path)),
  reopenConsoleTab: (id) => dispatch(reopenConsoleTab(id)),
  subscriptionSetMetadata: (id, metadata) => dispatch(subscriptionSetMetadata({id, metadata})),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionItem)