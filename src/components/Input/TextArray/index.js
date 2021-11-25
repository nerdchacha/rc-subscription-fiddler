import { FieldArray } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import './style.scss'

const TextArray = (props) => {
  const { values, id, label, onChange, onBlur } = props
  const listOfValues = values[id]
  return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <FieldArray name={id}>
          {({ push, remove }) => {
            const addToList = (e) => {
              e.preventDefault();
              push('')
            }
            const removeFromList = (index) => (e) => {
              e.preventDefault();
              remove(index)
            }
            return (
            <>
              {listOfValues.map((value, index) => {
              const touched = props.touched || []
              const error = props.error || []
              return (
                <div key={index} className="text-array-container">
                  <div>
                    <input
                      type="text"
                      value={value}
                      name={`${id}[${index}]`}
                      onChange={onChange}
                      onBlur={onBlur}
                      className="text-array-item"
                    />
                    {touched[index] && error[index] ? (<div className="error">{error[index]}</div>) : null}
                  </div>
                  {listOfValues.length > 1 ? <button className="remove rc-button primary" onClick={removeFromList(index)}><FontAwesomeIcon icon={faMinus} /></button> : ''}
                </div>
              )})}
              <button className="add rc-button primary" onClick={addToList}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </>
          )}}
        </FieldArray>
      </>
    )
}

export default TextArray