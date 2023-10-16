import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'

function sendDataToServer(data) {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => { console.log(response) })
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
      console.log('Fetch error: ', error);
    })
  }, [rkey]);
  return (
    <div style={{margin:10}}>
      <ShowWinner data={data} />
      <ShowSubmit hasSent={data.localRoll} refresh={refresh} />
    </div>
  );
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
      <p>Your daily roll: { data.localRoll?.toLocaleString() }</p>
      <p>{data.localRoll > data.roll ? 'You won! Refresh the page...' : ''}</p>
    </div>
  );
}

function ShowSubmit(props) {
  const [formData, setFormData] = useState({ message: '' });
  const onHandleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendDataToServer(formData);
    props.refresh(2);
  };
  if (props.hasSent) {
    return;
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" autoComplete='off' value={formData.message} name='message' onChange={onHandleChange} />
      <br />
      <button type='submit'>Submit and Roll</button>
    </form>
  );
}