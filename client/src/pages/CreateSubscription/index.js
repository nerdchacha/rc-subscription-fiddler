import { connect } from 'react-redux'
import { Grid } from '@mui/material'

import Form from './Form'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { createSubscription } from '../../actions'

import './style.scss'


const CreateSubscription = ({isLoading, createSubscription}) => {
  // TODO: Make a privte route component and use it in there
  useIsLoggedIn()

  const submitButtonProps = {loading: isLoading}
  return (
    <Grid container>
      <Grid item md={12} sm={12} className="grid-item">
        <Form handleSubmit={createSubscription} submitButtonProps={submitButtonProps} />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.metadata.create.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  createSubscription: (data) => dispatch(createSubscription(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubscription)