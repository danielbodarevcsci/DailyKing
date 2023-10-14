import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <ShowPosts />
  );
}

export default App;

function ShowPosts() {
  const [data, setData] = useState([]);
  console.log('loading posts...');
  useEffect(() => {
    fetch('./posts')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP Error! Status: ${response.status}')
      }
      return response.json();
    })
    .then(data => setData(data))
    .catch(error => {
      console.log('Fetch error: ', error);
    })
  }, []);
  return (
    <div style={{margin:10}}>
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