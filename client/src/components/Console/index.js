import { Resizable } from 're-resizable'
import { RcPaper, RcTabContext, RcTabList, RcTabPanel, RcTab, RcIconButton } from '@ringcentral/juno'
import { Close, Blocked } from '@ringcentral/juno/icon'
import { connect } from 'react-redux'

import { setConsoleActiveTab, setConsoleHeight, clearConsole } from '../../actions'

import './style.scss'

const width = '100%'
const defaultHeight = 40

const Console = ({activeTab, height, setHeight, setActiveTab, consoleData, clearConsole}) => {
  const handleTabClick = () => {
    if (height < defaultHeight + 10) { setHeight(500) }
  }
  
  const tabsData = [{
    label: 'Console',
    value: 'general',
  }, {
    label: 'Request/Response',
    value: 'requestResponse',
  }]

  const blacklist = ['general', 'requestResponse', 'metadata']

  Object.keys(consoleData).filter((key) => !blacklist.includes(key)).forEach((key, i) => {
    tabsData.push({
      label: `PubNub${i}`,
      value: key
    })
  })

  const TabChildren = tabsData.map((tab) => {
    const { label, value } = tab;
    return (
      <RcTab
        key={label}
        label={label}
        value={value}
        onClick={handleTabClick}
        className="tab"
      />
    );
  });

  const TabContentChildren = tabsData.map((tab) => {
    const { value } = tab;
    const data = consoleData[value] ? consoleData[value].data : []
    const renderContent = data.map(({type, text, isCode}, i) => {
      const content = isCode ? <pre>{text}</pre> : (
        <p className={type}>
          {text}
        </p>
      )
      return <div className="log-entry" key={i}>{content}</div>
    })
    return (
      <RcTabPanel key={value} value={value} className="tab-content" style={{maxHeight: height - 40}}>
        {renderContent}
      </RcTabPanel>
    );
  });

  return (
    <Resizable
      size={{ width, height }}
      onResizeStop={(e, direction, ref, d) => setHeight(height + d.height)}
      className="rc-subscription-console"
      maxHeight={900}
      minHeight={defaultHeight}
      minWidth="100%"
      style={{position: 'fixed'}}
    >
      <RcTabContext value={activeTab}>
        <RcPaper square className="paper-container">
          <div className="tab-list-container">
            <RcTabList onChange={(e, value) => setActiveTab(value)}>
              {TabChildren}
            </RcTabList>
          </div>
          <RcIconButton
            aria-label="clear"
            size="medium"
            title="Clear console"
            color="neutral.l01"
            TooltipProps={{placement: 'top'}}
            symbol={Blocked}
            onClick={() => clearConsole(activeTab)}
          />
          <RcIconButton
            aria-label="close"
            size="medium"
            title="Close"
            color="neutral.l01"
            TooltipProps={{placement: 'top'}}
            symbol={Close}
            onClick={() => setHeight(defaultHeight)}
          />
        </RcPaper>
        {TabContentChildren}
      </RcTabContext>
    </Resizable>
  )
}

const mapStateToProps = (state) => ({
  activeTab: state.console.metadata.activeTab,
  height: state.console.metadata.height,
  consoleData: state.console
})

const mapDispatchToProps = (dispatch) => ({
  setActiveTab: (value) => dispatch(setConsoleActiveTab(value)),
  setHeight: (value) => dispatch(setConsoleHeight(value)),
  clearConsole: (name) => dispatch(clearConsole(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(Console)