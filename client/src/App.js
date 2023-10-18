import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function sendDataToServer(data, rkey, refresh) {
  axios.post('http://localhost:5000/submit-message', data)
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
      <div class="d-flex flex-column align-items-center justify-content-center">
        <ShowWinner data={data} />
        <ShowSubmit hasSent={data.localRoll} refresh={refresh} rkey={rkey} />
        <button class="btn btn-secondary w-20 mt-5" onClick={resetData}>Clear</button>
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
    <div>
      <h1 class="h1">{data.location ?? 'Location not loaded'}</h1>
      <h1 class="display-4 text-center font-weight-thin mb-1">{data.message ?? '(No posts yet)'}</h1>
      <small class="font-weight-light">{data.roll?.toLocaleString()}</small>
      <p>{data.localRoll ? `You rolled: ${data.localRoll?.toLocaleString()}` : ''}</p>
    </div>
  );
}

function ShowSubmit(props) {
  const [formData, setFormData] = useState({ message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const onHandleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.message) {
      sendDataToServer(formData, props.rkey, props.refresh);
      props.refresh(props.rkey + 2);
      setIsSubmitted(true);
    }
  };
  if (props.hasSent) {
    return;
  }
  return (
    <form class="form-group w-75 mt-2" onSubmit={handleSubmit}>
      <textarea class="form-control" rows="3" value={formData.message} name='message' onChange={onHandleChange} />
      <button type='submit' class="btn btn-outline-success btn-lg w-100 mt-3" disabled={isSubmitted}>Submit and Roll</button>
    </form>
  );
}