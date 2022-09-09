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
    <form className="form-inline" onSubmit={handleSubmit}>
        <div className="input-group">

            <label> {nameForm} 
                <input className="form-control"
                    type = "text"
                    value={text}
                    onChange= {(e) => setText(e.target.value)}
                />
            </label>
        </div>
        <input  type='submit' value='Submit' className='btn btn-default'/>
    </form>
  )
}

export default Form