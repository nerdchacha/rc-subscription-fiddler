import { SnackbarProvider } from 'notistack'
import { RcIconButton } from '@ringcentral/juno'
import { Close } from '@ringcentral/juno/icon'
import { connect } from 'react-redux'

import NotificationApp from './NotificationApp'
import { closeSnackbar } from './actions'

const NotificationAppWrapper = ({closeSnackbar}) => {
  return (
    <SnackbarProvider
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      maxSnack={5}
      hideIconVariant
      preventDuplicate
      action={(key) => <RcIconButton size="xsmall" color="neutral.l01" symbol={Close} onClick={() => closeSnackbar(key)}/>}
    >
      <NotificationApp />
    </SnackbarProvider>
    )
  }

  const mapDispatchToProps = (dispatch) => ({
    closeSnackbar: (key) => dispatch(closeSnackbar(key))
  })
  
  export default connect(null, mapDispatchToProps)(NotificationAppWrapper)