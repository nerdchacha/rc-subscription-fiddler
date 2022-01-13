import { RcLink, RcList, RcListSubheader, RcListItem, RcTypography, RcListItemText } from '@ringcentral/juno'
import React from 'react'

import './style.scss'

const listItems = [{
    heading: 'Guide',
    items: [
      <React.Fragment>
        You can follow the detailed step-by-step guide <RcLink href="https://developers.ringcentral.com/guide/notifications" target="_blank"> here </RcLink> to see how to write your own code using our SDK
      </React.Fragment>
    ]
  }, {
    heading: 'Blogs / Articles',
    items: [
      <RcLink href="https://medium.com/ringcentral-developers/ringcentral-telephony-session-events-notifications-98b3f8d29745" target="_blank">RingCentral Telephony Session Events Notifications</RcLink>,
      <RcLink href="https://medium.com/ringcentral-developers/common-questions-on-webhooks-8dd3550f4525" target="_blank">Common Questions on WebHooks</RcLink>,
      <RcLink href="https://medium.com/ringcentral-developers/how-to-get-a-new-call-recording-notification-ee9f2a6e41a0" target="_blank">How to Get a New Call Recording Notification?</RcLink>,
      <RcLink href="https://medium.com/ringcentral-developers/api-spotlight-voicemails-2a086de8e13d" target="_blank">API Spotlight: Voicemails</RcLink>,
      <RcLink href="https://medium.com/ringcentral-developers/match-the-ringout-call-in-call-log-records-bb53e9c1f20c" target="_blank">Match the Ringout Call in Call-log records</RcLink>
    ]
  }, {
    heading: 'Tutorial',
    items: [
      <RcLink href="https://ringcentral-tutorials.github.io/webhook-basics-nodejs-demo" target="_blank">Demo app for RingCentral Webhook Basics</RcLink>,
      <RcLink href="https://ringcentral-quickstart.readthedocs.io/en/latest/webhooks/" target="_blank">Webhooks</RcLink>,
    ]
  }, {
    heading: 'API Reference',
    items: [
      <RcLink href="https://developers.ringcentral.com/api-reference/Subscriptions/listSubscriptions" target="_blank">Subscriptions</RcLink>,
    ]
  }, {
    heading: 'Community Questions',
    items: [
      <RcLink href="https://community.ringcentral.com/search.html?c=144&includeChildren=true&type=question&sort=relevance&q=subscriptions" target="_blank">Questions</RcLink>,
    ]
  }
]

const renderList = ({heading, items}) => {
  const renderItems = items.map((item) => {
    return (
      <RcListItem divider canHover={false}>
        <RcListItemText>  
        <RcTypography variant='subheading1'>
          {item}
        </RcTypography>
        </RcListItemText>
      </RcListItem>
    )
  })
  return (
    <React.Fragment>
      <RcListSubheader>
        <RcTypography variant='headline2'>{heading}</RcTypography>
      </RcListSubheader>
      {renderItems}
    </React.Fragment>
  )
}

const Resources = () => {
  return (
    <RcList className="resources-container">
      {listItems.map(renderList)}
    </RcList>
  )
}

export default Resources