import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <ShowPosts />
  );
}

export default App;

let url = 'http://localhost:5000/';

function ShowPosts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url, { headers:{'Access-Control-Allow-Origin': '*'}})
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
  }, []);
  return (
    <div style={{margin:10}}>
      <p>City: {data.city}</p>
      <p>Message: {data.message}</p>
      <p>Winning Roll: {data.roll?.toLocaleString()}</p>
      <p>Your Roll: {data.newroll?.toLocaleString()}</p>
    </div>
  );
}