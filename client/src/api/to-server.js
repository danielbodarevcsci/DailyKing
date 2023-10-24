import axios from 'axios';

export const submitMessage = (data, rkey, refresh) => {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};

export const submitVote = (vote) => {
  axios.post('http://localhost:5000/vote', { vote: vote })
    .then(response => {
      console.log(response);
    })
    .catch(error => console.error(error));
};
  
export const rollNumber = (rkey, refresh) => {
  axios.post('http://localhost:5000/roll-number')
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
};