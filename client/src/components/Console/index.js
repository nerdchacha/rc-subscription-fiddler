import { createRef } from 'react'
import { Resizable } from 're-resizable'
import { RcPaper, RcTabContext, RcTabList, RcTabPanel, RcTab, RcIconButton, RcIcon, RcTooltip } from '@ringcentral/juno'
import { Close, Blocked, JumpToLatest, JumpToUnread, Copy, UnfoldLess, UnfoldMore } from '@ringcentral/juno/icon'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell } from '@mui/material'

import Accordion from '../Accordion'
import { setConsoleActiveTab, setConsoleHeight, clearConsole, deleteConsole, consoleFoldAll, consoleUnfoldAll } from '../../actions'

import './style.scss'

const width = '100%'
const defaultHeight = 40

const Console = ({activeTab, height, setHeight, setActiveTab, consoleData, clearConsole, deleteConsole, foldAll, unfoldAll}) => {
  const endRef = createRef()
  const startRef = createRef()

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
      label: (
        <RcTooltip title={key} placement="top">
          <span>{`PubNub/${key.substring(0, 10)}...`}</span>
        </RcTooltip>
      ),
      value: key
    })
  })

  const TabChildren = tabsData.map((tab) => {
    const handleDeleteTab = (e) => {
      e.stopPropagation()
      deleteConsole(value)
    }
    const { label, value } = tab;
    const renderIcon = blacklist.includes(value) ? '' : <RcIcon symbol={Close} size="xsmall" onClick={handleDeleteTab} />
    const labelAndIcon = (
      <div className="tab-label-container">
       {label}
       {renderIcon}
      </div>
    )
    return (
      <RcTab
        key={label}
        label={labelAndIcon}
        value={value}
        onClick={handleTabClick}
        className="tab"
      />
    );
  });

  const transformConsoleData = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => Object.assign({}, item, item.collapsible && {accordianSummary: '{...}'}))
    }
    // This is request response tab
    return Object.keys(data).reduce((seed, requestId) => {
      const { request, response } = data[requestId]
      if (request) {
        seed.push({type: 'success', text: 'Request', isCode: false, canCopy: true , collapsible: false, contentToCopy: JSON.stringify(request, null, 2), fold: !!request.fold})
        seed.push({type: 'text', text: `URL : ${request.url}`, isCode: true, canCopy: false , collapsible: false, fold: !!request.fold})
        seed.push({type: 'text', text: `Method : ${request.method}`, isCode: true, canCopy: false , collapsible: false, fold: !!request.fold})
        if (request.body) { seed.push({type: 'text', text: `${request.body}`, isCode: true, canCopy: false , collapsible: true, accordianSummary: 'Body', fold: !!request.fold}) }
        const requestHeaders = Object.keys(request.headers).map((header) => (
          <TableRow>
            <TableCell size='small'>{header}</TableCell>
            <TableCell size='small'>{request.headers[header]}</TableCell>
          </TableRow>
        ))
        seed.push({type: 'text', text: <Table>{requestHeaders}</Table>, isCode: false, canCopy: false , collapsible: true, accordianSummary: 'Headers', fold: !!request.fold})
      }
      if (response) {
        seed.push({type: 'info', text: 'Response', isCode: false, canCopy: true , collapsible: false, contentToCopy: JSON.stringify(response, null, 2), fold: !!request.fold})
        seed.push({type: 'text', text: `Status : ${response.status}`, isCode: true, canCopy: false , collapsible: false, fold: !!request.fold})
        if (response.body) { seed.push({type: 'text', text: `${response.body}`, isCode: true, canCopy: false , collapsible: true, accordianSummary: 'Body', fold: !!request.fold}) }
        const responseHeaders = Object.keys(response.headers).map((header) => (
          <TableRow>
            <TableCell size='small'>{header}</TableCell>
            <TableCell size='small'>{response.headers[header]}</TableCell>
          </TableRow>
        ))
        seed.push({type: 'text', text: <Table>{responseHeaders}</Table>, isCode: false, canCopy: false , collapsible: true, accordianSummary: 'Headers', fold: !!request.fold})
      }
      return seed
    }, [])
  }

  const TabContentChildren = tabsData.map((tab) => {
    const { value } = tab;
    const data = consoleData[value] ? consoleData[value].data : []
    const transformedData = transformConsoleData(data)
    const renderContent = transformedData.map(({type, text, isCode, canCopy, collapsible, fold, accordianSummary, contentToCopy}, i) => {
      const content = isCode ? <pre>{text}</pre> : (
        <p className={type}>
          {text}
        </p>
      )
      const renderIcons = canCopy ? (
        <RcTooltip title="copy" >
          <RcIcon symbol={Copy} size="small" onClick={() => navigator.clipboard.writeText(contentToCopy || text)} />
        </RcTooltip>
      ) : ''
      
      const renderContent = collapsible ? (
        <Accordion
          summary={accordianSummary}
          detail={content}
          iconButtonProps={{variant: 'contained', size: 'xsmall'}}
          defaultExpaned={!!!fold}
        />
      ) :
      content

      return (
      <div className="log-entry" key={i}>
        <div className="icons">{renderIcons}</div>
        <div className="text">{renderContent}</div>
      </div>
      )
    })
    const renderIcons = transformedData.length ? (
      <div className="icons">
        <RcIconButton
          size="large"
          title="Scroll to top"
          color="neutral.l01"
          TooltipProps={{placement: 'top'}}
          symbol={JumpToUnread}
          onClick={() => startRef.current.scrollIntoView({ behavior: 'smooth' })}
        />
        <RcIconButton
          size="large"
          title="Scroll to bottom"
          color="neutral.l01"
          TooltipProps={{placement: 'top'}}
          symbol={JumpToLatest}
          onClick={() => endRef.current.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>
    ) : ''
    return (
      <RcTabPanel key={value} value={value} className="tab-content" style={{height: height - 40, display: activeTab === value ? 'flex': 'none'}}>
        <div className="text">
          <div ref={startRef} />
          {renderContent}
          <div ref={endRef} />
        </div>
        {renderIcons}
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
            <RcTabList onChange={(e, value) => setActiveTab(value)} variant="scrollable" scrollButtons="auto">
              {TabChildren}
            </RcTabList>
          </div>
          <RcIconButton
            aria-label="fold all"
            size="medium"
            title="Collapse all items"
            color="neutral.l01"
            TooltipProps={{placement: 'top'}}
            symbol={UnfoldLess}
            onClick={() => foldAll(activeTab)}
          />
          <RcIconButton
            aria-label="unfold all"
            size="medium"
            title="Expand all items"
            color="neutral.l01"
            TooltipProps={{placement: 'top'}}
            symbol={UnfoldMore}
            onClick={() => unfoldAll(activeTab)}
          />
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
  clearConsole: (name) => dispatch(clearConsole(name)),
  deleteConsole: (id) => dispatch(deleteConsole(id)),
  foldAll: (name) => dispatch(consoleFoldAll(name)),
  unfoldAll: (name) => dispatch(consoleUnfoldAll(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Console)