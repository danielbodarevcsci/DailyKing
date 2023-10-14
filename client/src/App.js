import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  return (
    ShowPosts()
  );
}

export default App;

function ShowPosts() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/posts')
    .then(response => response.json())
    .then(data => setData(data));
  }, []);
  return (
    <div style={{margin:10}}>
      <h2>Posts:</h2>
      {data}
      <p>{data.length} total</p>
    </div>
  );
}