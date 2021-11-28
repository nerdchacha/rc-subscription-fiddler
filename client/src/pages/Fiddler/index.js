import { Grid } from '@mui/material'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { push } from 'connected-react-router'

import Options from '../../components/Options'
import Terminal from '../../components/Terminal'

import './style.scss'

const Fiddler = ({ isLoggedIn, push }) => {
  useEffect(() => {
    if (!isLoggedIn) { return push('/login') }
  }, [isLoggedIn])
  return (
    <>
      <Grid item md={6} className="grid-item">
        <Options />
      </Grid>
      <Grid item md={6} className="grid-item">
        <Terminal />
      </Grid>
    </>
  )
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path))
})
export default connect(mapStateToProps, mapDispatchToProps)(Fiddler)