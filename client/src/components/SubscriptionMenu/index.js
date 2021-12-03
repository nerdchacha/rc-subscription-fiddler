import { Link, useLocation } from 'react-router-dom'
import { RcDrawer } from '@ringcentral/juno'

import './style.scss'
import { ROUTES } from '../../constants'

const options = [
  {text: 'Get Subscriptions', link: ROUTES.GET_SUBSCRIPTIONS},
  {text: 'Get Subscription', link: ROUTES.GET_SUBSCRIPTION},
  {text: 'Create Subscription', link: ROUTES.CREATE_SUBSCRIPTION},
  {text: 'Update Subscription', link: ROUTES.UPDATE_SUBSCRIPTION},
  {text: 'Cancel Subscription', link: ROUTES.CANCEL_SUBSCRIPTION}
]

const SubscriptionMenu = (props) => {
  const location = useLocation()
  
  const renderOptions = options.map(({text, link}, i) => {
    return (
      <div className="item" key={i}>
        <p className={location.pathname === link ? 'active' : ''}><Link to={link}>{text}</Link></p>
      </div>
    )
  })
  return (
    <RcDrawer className="subscription-menu" open variant="persistent" radius="zero">
      {renderOptions}
    </RcDrawer>
  )
}

export default SubscriptionMenu