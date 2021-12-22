import { FieldArray } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { RcButton } from '@ringcentral/juno'

import './style.scss'

const TextArray = (props) => {
  const { values, id, label, onChange, onBlur, placeholder } = props
  const listOfValues = values[id]
  return (
      <>
        <label className="rc-label" htmlFor={props.id || props.name}>{label}</label>
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
                      placeholder={placeholder}
                      className="rc-input text-array-item"
                    />
                    {touched[index] && error[index] ? (<div className="error">{error[index]}</div>) : null}
                  </div>
                  {listOfValues.length > 1 ? (
                    <FontAwesomeIcon onClick={removeFromList(index)} size="xs" icon={faTimes} color="tomato" />
                  ) : ''}
                </div>
              )})}
              <RcButton radius="zero" size="small" onClick={addToList}>
                <FontAwesomeIcon icon={faPlus} />
              </RcButton>
            </>
          )}}
        </FieldArray>
      </>
    )
}

export default TextArray