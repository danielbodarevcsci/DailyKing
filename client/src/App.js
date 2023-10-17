import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'

function sendDataToServer(data) {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => console.log(response))
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
    <div style={{margin:10}}>
      <ShowWinner data={data} />
      <ShowSubmit hasSent={data.localRoll} refresh={refresh} rkey={rkey} />
      <br /><br />
      <button onClick={resetData}>clear</button>
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
      <h2>{data.location}</h2>
      <h4>{data.message ?? '(No posts yet)'}</h4>
      <p>{data.roll?.toLocaleString()}</p>
      <p>{data.localRoll ? `You rolled: ${data.localRoll?.toLocaleString()}` : ''}</p>
      <p>{data.localRoll > data.roll ? 'You won! Refresh the page...' : ''}</p>
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
      sendDataToServer(formData);
      props.refresh(props.rkey + 1);
      setIsSubmitted(true);
    }
  };
  if (props.hasSent) {
    return;
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" autoComplete='off' value={formData.message} name='message' onChange={onHandleChange} />
      <br />
      <button type='submit' disabled={isSubmitted}>Submit and Roll</button>
    </form>
  );
}