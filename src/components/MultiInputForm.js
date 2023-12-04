import { useState } from 'react';

const Form = ({ nameForm, onSave }) => {
  const [textArray, setTextArray] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (textArray.length === 0) {
      alert('Enter text');
      return;
    }

    onSave({ text: textArray });
    setTextArray([]);
  };

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <div className="input-group">
        <label>
          <input
            className="form-control"
            type="text"
            value={textArray.join(', ')}
            onChange={(e) => setTextArray(e.target.value.split(', '))}
            placeholder={nameForm}
          />
        </label>
      </div>
      <input type="submit" value="Submit" className="btn btn-default" />
    </form>
  );
};

export default Form;
