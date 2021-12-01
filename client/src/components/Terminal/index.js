import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEraser } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '../Tooltip'

import './style.scss'

const Terminal = (props) => {
  const { clearConsole, data } = props
  const handleCopy = (index) => (e) => {
    navigator.clipboard.writeText(data[index].text);
  }

  const renderData = (data) => {
    return data.map(({type, text, canCopy}, i) => (
      <div key={i} className="console-line">
        <pre className={type}>{text}</pre>
        { canCopy ? 
        (
          <Tooltip title="copy" placement="top">
            <span><FontAwesomeIcon onClick={handleCopy(i)} icon={faCopy} /></span>
          </Tooltip>
        ) : '' }
      </div>
    )
  )}

  return (
    <div className="rc-terminal">
      <div className="action-container">
        <Tooltip title="Clear console" placement="bottom">
          <span><FontAwesomeIcon icon={faEraser} size="2x" onClick={clearConsole} /></span>
        </Tooltip>
      </div>
      {renderData(props.data)}
    </div>
  )
}

export default Terminal