import { Link, useLocation } from 'react-router-dom'
import { RcDrawer } from '@ringcentral/juno'

import './style.scss'

const options = [
  {text: 'Get Subscriptions', link: '/get-subscriptions'},
  {text: 'Create Subscription', link: '/create-subscription'},
  {text: 'Get Subscription', link: '/get-subscription'},
  {text: 'Update Subscription', link: '/update-subscription'},
  {text: 'Remove Subscription', link: '/remove-subscription'}
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