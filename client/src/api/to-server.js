import axios from 'axios';
require('dotenv').config({path: "./client/.env"});

const addr = `http://${process.env.EC2IP}:${process.env.EC2PORT}`;

export const submitMessageToServer = (data, rkey, refresh) => {
  axios.post(`${addr}/submit-message`, data)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};

export const submitVoteToServer = (vote) => {
  axios.post(`${addr}/vote`, { vote: vote })
    .then(response => {
      console.log(response);
    })
    .catch(error => console.error(error));
};
  
export const rollNumberOnServer = (rkey, refresh) => {
  axios.post(`${addr}/roll-number`)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};