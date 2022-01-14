import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { useParams } from 'react-router-dom'

import Form from '../../components/Form';
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { updateSubscription } from '../../actions'

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
}, {
  id: 'eventFilters',
  label: 'Event Filters*',
  type: 'textArray',
  initialValue: [''],
  yupType: [{
    id: 'eventFilter',
    yupType: 'string',
    validations: [
      {
        type: 'required',
        params: ['Event Filter is required'],
      }
    ]
  }]
}, {
  id: 'expiresIn',
  label: 'Expires In',
  placeholder: 'Subscription lifetime in seconds (Only available for webhook right now)',
  type: 'number',
  yupType: 'number',
  validations: [
    {
      type: 'integer',
      params: ['Expires in should be a number'],
    }
  ]
}]

const UpdateSubscriptions = ({updateSubscription, isLoading}) => {
  // TODO: Make a privte route component and use it in there
  useIsLoggedIn()
  const { id } = useParams();
  const formData = data.map((item) => {
    if (item.id === 'subscriptionId') {
      return Object.assign({}, item, {initialValue: id})
    }
    return item
  })
  const submitButtonProps = {loading: isLoading}
  return (
    <Grid container>
      <Grid item md={12} className="grid-item">
        <Form data={formData} submitButtonProps={submitButtonProps} submitButtonText='Update Subscribe' handleSubmit={updateSubscription} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.metadata.update.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  updateSubscription: (data) => dispatch(updateSubscription(data)),

})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSubscriptions)