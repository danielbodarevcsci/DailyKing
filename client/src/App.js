import './App.css';
import React, { useState, useEffect } from 'react';
import { submitMessageToServer, submitVoteToServer, rollNumberOnServer } from './api/to-server';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return <ShowPosts />
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
      </div>
    </div>
  );
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
  if (!data?.message) {
    return <small class="fw-light">No posts yet.</small>;
  }
  return (
    <div class="bg-light border rounded p-3">
      <div class="display-6 fw-light text-break">{data.message}</div>
      <ShowVotes data={data} />
    </div>
  );
}

function ShowVotes({ data }) {
  const [tuHovered, setTuHovered] = useState(false);
  const [tdHovered, setTdHovered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(data?.thumbsup || 0);
  const [thumbsDown, setThumbsDown] = useState(data?.thumbsdown || 0);
  const [liked, setLiked] = useState(false);
  const tuEnter = () => setTuHovered(true);
  const tuLeave = () => setTuHovered(false);
  const tdEnter = () => setTdHovered(true);
  const tdLeave = () => setTdHovered(false);
  const tuClass = tuHovered || (hasVoted && liked) ? "bi vote bi-hand-thumbs-up-fill" : "bi vote bi-hand-thumbs-up";
  const tdClass = tdHovered || (hasVoted && !liked) ? "bi vote bi-hand-thumbs-down-fill" : "bi vote bi-hand-thumbs-down";
  useEffect(() => {
    setThumbsUp(data?.thumbsup || 0);
    setThumbsDown(data?.thumbsdown || 0);
  }, [data]);
  const tuClick = () => {
    submitVoteToServer("up");
    setThumbsUp(thumbsUp + 1)
    setHasVoted(true);
    setLiked(true);
  };
  const tdClick = () => {
    submitVoteToServer("down");
    setThumbsDown(thumbsDown + 1);
    setHasVoted(true);
    setLiked(false);
  };
  return (
    <div class="w-100 d-flex justify-content-start">
      <button 
        onClick={tuClick} 
        onMouseEnter={tuEnter} 
        onMouseLeave={tuLeave} 
        class="btn voteBtn"
        disabled={hasVoted}>
          <i class={tuClass}></i>
          <small>{ thumbsUp.toLocaleString() }</small>
      </button>
      <button 
        onClick={tdClick} 
        onMouseEnter={tdEnter} 
        onMouseLeave={tdLeave} 
        class="btn voteBtn"
        disabled={hasVoted}>
          <i class={tdClass}></i>
          <small>{ thumbsDown.toLocaleString() }</small>
      </button>
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