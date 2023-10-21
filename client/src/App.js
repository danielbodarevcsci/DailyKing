import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function submitMessageToServer(data, rkey, refresh) {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
}

function rollNumberOnServer(rkey, refresh) {
  axios.post('http://localhost:5000/roll-number')
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
}

function App() {
  return (
    <ShowPosts />
  );
}

export default App;

function ShowPosts() {
  const [data, setData] = useState([]);
  const [rkey, refresh] = useState(0);
  useEffect(() => {
    fetch('http://localhost:5000/', { headers:{'Access-Control-Allow-Origin': '*'}})
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setData(data);
    })
    .catch(error => {
      console.error('Fetch error: ', error);
    })
  }, [rkey]);
  return (
    <div class="container">
      <div class="d-flex flex-column align-items-center justify-content-center mt-5">
        <ShowWinner data={data} />
        <ShowInput data={data} refresh={refresh} rkey={rkey} />
        <button class="btn btn-outline-secondary btn-sm w-20 mt-5" onClick={resetData}>Clear</button>
      </div>
    </div>
  );
}

function resetData() {
  axios.post('http://localhost:5000/reset')
    .then(response => console.log(response))
    .catch(error => console.error(error));
  window.location.reload();
}

function ShowWinner({ data }) {
  if (!data) {
    return <p>No posts found in your location...</p>;
  }
  return (
    <div class="d-flex flex-column align-items-center justify-content-center text-center">
      <h1 class="h1">{data.location ?? 'Location not loaded'}</h1>
      <ShowWinnerMessage data={data} />
      <small class="fw-light">{data.roll?.toLocaleString()}</small>
      <p class="fw-light mt-4">{data.localRoll ? `You rolled: ${data.localRoll?.toLocaleString()}` : ''}</p>
    </div>
  );
}

function ShowWinnerMessage({ data }) {
  const [mouseOver, setMouseOver] = useState(false);
  const handleMouseOver = () => {
    setMouseOver(true);
  };
  const handleMouseOut = () => {
    setMouseOver(false);
  };
  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}
      class="bg-light border rounded p-3">
      <div class="display-6 fw-light text-break">{data.message ?? '(No posts yet)'}</div>
      {mouseOver ?? <p>Mouse over brug</p>}
    </div>
  );
}

function ShowInput({ data, refresh, rkey }) {
  // If already rolled.
  if (data.localRoll) {
    return <ShowSubmit data={data} refresh={refresh} rkey={rkey} />
  } else {
    return <ShowRoll refresh={refresh} rkey={rkey} />
  }
}

function ShowRoll({ refresh, rkey }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleClick = (e) => {
    rollNumberOnServer(rkey, refresh);
    setIsSubmitted(true);
  };
  return (
    <button onClick={handleClick} disabled={isSubmitted} class="btn btn-outline-danger btn-sm w-25 mt-2">
      Roll a Number
    </button>
  );
}

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
  if (data.localRoll == data.roll) {
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