import { Link, useLocation } from 'react-router-dom'
import { RcDrawer, RcDivider } from '@ringcentral/juno'

import './style.scss'
import { ROUTES } from '../../constants'

const options = [
  [
    {text: 'Create Subscription', link: ROUTES.CREATE_SUBSCRIPTION},
    {text: 'Get Subscriptions', link: ROUTES.GET_SUBSCRIPTIONS},
    {text: 'Update Subscription', link: ROUTES.UPDATE_SUBSCRIPTION},
    {text: 'Cancel Subscription', link: ROUTES.CANCEL_SUBSCRIPTION},
    {text: 'Get Subscription', link: ROUTES.GET_SUBSCRIPTION},
  ],
  [
    {text: 'Resources', link: ROUTES.RESOURCES},
    // {text: 'Code', link: ROUTES.CODE}
  ]
]

const SubscriptionMenu = (props) => {
  const location = useLocation()
  const path = `/${location.pathname.split('/')[1]}`
  const renderOptions = options.reduce((seed, section, i) => {
    const items = section.map(({text, link}, j) => {
      return (
        <div className="item" key={`${i}_${j}`}>
          <p className={path === link ? 'active' : ''}><Link to={link}>{text}</Link></p>
        </div>
      )
    })
    return [...seed, ...items, <RcDivider />]
  }, [])
  return (
    <RcDrawer className="subscription-menu" open variant="persistent" radius="zero">
      {renderOptions}
    </RcDrawer>
  )
}

export default SubscriptionMenu