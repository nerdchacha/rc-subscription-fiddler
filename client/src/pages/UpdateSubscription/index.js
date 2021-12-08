import { connect } from 'react-redux'
import { Grid } from '@mui/material'
import { useParams } from 'react-router-dom'

import Form from '../../components/Form';
import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { clearConsole, updateSubscription } from '../../actions'

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
}]

const UpdateSubscriptions = ({consoleData, clearConsole, updateSubscription}) => {
  // TODO: Make a privte route component and use it in there
  useIsLoggedIn()
  const { id } = useParams();
  const formData = data.map((item) => {
    if (item.id === 'subscriptionId') {
      return Object.assign({}, item, {initialValue: id})
    }
    return item
  })
  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <Form data={formData} submitButtonText='Update Subscribe' handleSubmit={updateSubscription} />
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal data={consoleData} clearConsole={clearConsole} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  consoleData: state.console.updateSubscription.data
})

const mapDispatchToProps = (dispatch) => ({
  clearConsole: () => dispatch(clearConsole('updateSubscription')),
  updateSubscription: (data) => dispatch(updateSubscription(data)),

})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSubscriptions)