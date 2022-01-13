import { useState, useEffect } from 'react'
import { RcAccordion, RcAccordionSummary, RcAccordionDetails } from '@ringcentral/juno'

const Accordion = ({defaultExpaned = true, summary, detail, iconButtonProps}) => {
  const [expanded, toggleExpand] = useState(defaultExpaned)
  useEffect(() => {toggleExpand(defaultExpaned)}, [defaultExpaned])
  return (
    <RcAccordion className="collapsible" expanded={expanded}>
      <RcAccordionSummary expandIcon IconButtonProps={iconButtonProps} onClick={(e) => toggleExpand(!expanded)}>
        {summary}
      </RcAccordionSummary>
      <RcAccordionDetails>
        {detail}
      </RcAccordionDetails>
    </RcAccordion>
  )
}

export default Accordion