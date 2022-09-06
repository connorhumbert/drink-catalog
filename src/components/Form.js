import {useState} from 'react'

const Form = ({nameForm, onSave}) => {
    const [text, setText] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!text){
            alert('enter text');
            return;
        }

        onSave({text});

        setText("");
    }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
        <div className='form-control'>

        <label> {nameForm} 
            <input
                type = "text"
                value={text}
                onChange= {(e) => setText(e.target.value)}
            />
        </label>
        </div>
        <input  type='submit' value='Submit' className='btn btn-block'/>
    </form>
  )
}

export default Form