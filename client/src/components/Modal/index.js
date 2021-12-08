import { RcDialog, RcDialogTitle, RcDialogActions, RcButton, RcDialogContent } from '@ringcentral/juno'

const Modal = ({
  open = false,
  cancelText = 'Cancel',
  confirmText = 'Confim',
  onCancel,
  onConfirm,
  title,
  disableCancel,
  children
}) => {
  const renderTitle = title ? <RcDialogTitle>{title}</RcDialogTitle> : null
  const renderActions = (
    <RcDialogActions direction="horizontal" size="medium">
      {disableCancel ? '' : (
        <RcButton variant="text" onClick={onCancel}>
        {cancelText}
      </RcButton>
      )}
      <RcButton onClick={onConfirm}>
        {confirmText}
      </RcButton>
    </RcDialogActions>
  )

  return (
    <RcDialog size="medium" fullWidth open={open} scroll="body">
      {renderTitle}
      <RcDialogContent>{children}</RcDialogContent>
      {renderActions}
    </RcDialog>
  )
}

export default Modal