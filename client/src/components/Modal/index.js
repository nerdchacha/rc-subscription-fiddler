import { RcDialog, RcDialogTitle } from '@ringcentral/juno'
import { Container } from '@mui/material'

const Modal = ({open = false, title, children}) => {
  const renderTitle = title ? <RcDialogTitle>{title}</RcDialogTitle> : null

  return (
    <RcDialog size="medium" fullWidth open={open} scroll="body">
      <Container>
        {renderTitle}
        {children}
      </Container>
    </RcDialog>
  )
}

export default Modal