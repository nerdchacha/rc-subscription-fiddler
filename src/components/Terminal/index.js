import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

import './style.scss'

const Terminal = (props) => {
  const handleCopy = (index) => (e) => {
    navigator.clipboard.writeText(props.data[index].text);
  }

  const renderData = (data) => {
    return data.map((line, i) => (
      <div key={i} className="console-line">
        <pre>{line.text}</pre>
        { line.canCopy ? <FontAwesomeIcon onClick={handleCopy(i)} icon={faCopy} /> : '' }
      </div>
    )
  )}

  return (
    <div className="rc-terminal">
      {renderData(props.data)}
    </div>
  )
}

const mapStateToProps = (state) => ({
  data: state.console.data
})

export default connect(mapStateToProps)(Terminal)