import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <ShowPosts />
  );
}

export default App;

let url = 'http://localhost:5000';

function ShowPosts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${url}/posts`)
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
      <ShowLocation />
      <h2>Posts:</h2>
      {data.map((post, index) => (
        <div key={index}>
          <p style={{fontStyle:'italic'}}>{post.description}</p>
        </div>
      ))}
      <p>{data.length} total</p>
    </div>
  );
}

function ShowLocation() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${url}/location`)
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
    <div>
      <h2>Location:</h2>
      <p>{data.city}</p>
    </div>
  );
}