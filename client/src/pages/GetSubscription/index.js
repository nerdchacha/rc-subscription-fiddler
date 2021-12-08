import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { RcIconButton, RcAccordion, RcAccordionSummary, RcAccordionDetails, RcTypography } from '@ringcentral/juno'
import { Copy, Remove, Edit } from '@ringcentral/juno/icon'
import { push } from 'connected-react-router'

import Form from '../../components/Form'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { subscriptionSetMetadata, cancelSubscription, getSubscription } from '../../actions'
import { ROUTES } from '../../constants'

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

const GetSubscription = ({subscription, getSubscription, subscriptionMetadata, cancelSubscription, push, subscriptionSetMetadata}) => {
  useIsLoggedIn()

  const handleSubmit = ({ subscriptionId }) => {
    getSubscription(subscriptionId)
  }

  const handleCancel = (id) => (e) => {
    e.stopPropagation()
    subscriptionSetMetadata(id, {deleting: true})
    cancelSubscription(id)
  }

  const renderSubscriptions = () => {
    if (!subscription.id) { return '' }
    const {id} = subscription
    return (
      <div key={id}>
        <RcAccordion variant="outlined">
            <RcAccordionSummary className="accordian-summary">
              <RcTypography variant="caption2">{id}</RcTypography>
              <div className="icon-container">
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
  }

  return (
    <Grid container>
      <Grid item md={12} className="grid-item">
        <Form data={data} submitButtonText='Get Subscription' handleSubmit={handleSubmit} />
        <div className="subscription-container">
          {renderSubscriptions()}
        </div>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  subscription: state.subscription.individual,
  subscriptionMetadata: state.subscription.metadata
})

const mapDispatchToProps = (dispatch) => ({
  getSubscription: (subscriptionId) => dispatch(getSubscription(subscriptionId)),
  cancelSubscription: (id) => dispatch(cancelSubscription(id)),
  push: (path) => dispatch(push(path)),
  subscriptionSetMetadata: (id, metadata) => dispatch(subscriptionSetMetadata({id, metadata}))
})

export default connect(mapStateToProps, mapDispatchToProps)(GetSubscription)