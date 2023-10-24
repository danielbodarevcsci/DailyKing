import './PostDisplay.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { submitVoteToServer } from '../../api/to-server.js';
import React, { useState, useEffect } from 'react';

const PostDisplay = ({ data }) => {
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
 };

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

export default PostDisplay;