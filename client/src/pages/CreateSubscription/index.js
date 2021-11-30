import { Grid } from '@mui/material'

import Options from '../../components/Options'
import Terminal from '../../components/Terminal'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'

import './style.scss'

const CreateSubscriptions = () => {
  useIsLoggedIn()
  return (
    <Grid container>
      <Grid item md={4} sm={12} className="grid-item">
        <Options />
      </Grid>
      <Grid item md={8} sm={12} className="grid-item">
        <Terminal />
      </Grid>
    </Grid>
  )
}

export default CreateSubscriptions