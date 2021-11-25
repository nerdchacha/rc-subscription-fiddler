import { connect } from 'react-redux'

import './style.scss'

const renderData = (data) => {
  return data.map((line, i) => <div key={i}><pre>{line}</pre></div>)
}

const Terminal = (props) => {
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