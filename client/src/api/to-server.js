import axios from 'axios';

const addr = `http://${process.env.REACT_APP_EC2IP}:${process.env.REACT_APP_EC2PORT}`;

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