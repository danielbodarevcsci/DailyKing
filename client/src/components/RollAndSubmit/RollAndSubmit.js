import 'bootstrap/dist/css/bootstrap.min.css';
import { submitMessageToServer, rollNumberOnServer } from '../../api/to-server.js';
import React, { useState } from 'react';

const RollAndSubmit = ({ data, refresh, rkey }) => {
    // If already rolled.
    if (data.localRoll) {
        return <ShowSubmit data={data} refresh={refresh} rkey={rkey} />
    } else {
        return <ShowRoll refresh={refresh} rkey={rkey} />
    }
};

function ShowSubmit({ data, refresh, rkey }) {
  const [formData, setFormData] = useState({ message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const onHandleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.message) {
      submitMessageToServer(formData, rkey, refresh);
      setIsSubmitted(true);
    }
  };
  if (data.localRoll < data.roll) {
    return <p class="fw-semibold mt-4">Try again tomorrow.</p>
  }
  if (data.localRoll === data.roll) {
    return;
  }
  return (
    <form class="form-group w-50" onSubmit={handleSubmit}>
      <textarea class="form-control" maxLength={255} rows="3" value={formData.message} name='message' onChange={onHandleChange} />
      <button type='submit'class="btn btn-outline-success btn-sm w-100 mt-2" disabled={isSubmitted}>
        Submit
      </button>
    </form>
  );
}

function ShowRoll({ refresh, rkey }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleClick = () => {
    rollNumberOnServer(rkey, refresh);
    setIsSubmitted(true);
  };
  return (
    <button onClick={handleClick} disabled={isSubmitted} class="btn btn-outline-danger btn-sm w-25 mt-2">
      Roll a Number
    </button>
  );
}

export default RollAndSubmit;