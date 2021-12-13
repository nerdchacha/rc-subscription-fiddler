import { SnackbarProvider } from 'notistack'
import { RcIconButton } from '@ringcentral/juno'
import { Close } from '@ringcentral/juno/icon'
import { connect } from 'react-redux'

import SubscriptionApp from './SubscriptionApp'
import { closeSnackbar } from './actions'

const SubscriptionAppWrapper = ({closeSnackbar}) => {
  return (
    <SnackbarProvider
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      maxSnack={3}
      hideIconVariant
      action={(key) => <RcIconButton size="xsmall" color="neutral.l01" symbol={Close} onClick={() => closeSnackbar(key)}/>}
    >
      <SubscriptionApp />
    </SnackbarProvider>
    )
  }

  const mapDispatchToProps = (dispatch) => ({
    closeSnackbar: (key) => dispatch(closeSnackbar(key))
  })
  
  export default connect(null, mapDispatchToProps)(SubscriptionAppWrapper)