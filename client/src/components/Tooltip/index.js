// TODO: Remove
import { RcTooltip } from '@ringcentral/juno'

const Tooltip = ({placement = 'bottom', title, children}) => {
  return (
    <RcTooltip title={title} placement={placement}>
      {children}
    </RcTooltip>
  )
}

export default Tooltip