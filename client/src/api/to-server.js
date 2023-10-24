import axios from 'axios';

export const submitMessageToServer = (data, rkey, refresh) => {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};

export const submitVoteToServer = (vote) => {
  axios.post('http://localhost:5000/vote', { vote: vote })
    .then(response => {
      console.log(response);
    })
    .catch(error => console.error(error));
};
  
export const rollNumberOnServer = (rkey, refresh) => {
  axios.post('http://localhost:5000/roll-number')
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};