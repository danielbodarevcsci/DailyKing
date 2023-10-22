import axios from 'axios';

function submitMessageToServer(data, rkey, refresh) {
  axios.post('http://localhost:5000/submit-message', data)
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
}
  
function rollNumberOnServer(rkey, refresh) {
  axios.post('http://localhost:5000/roll-number')
    .then(response => {
      console.log(response);
      refresh(rkey + 1);
    })
    .catch(error => console.error(error));
}

function sendVoteToServer(vote) {
  axios.post('http://localhost:5000/vote', { vote: vote })
    .then(response => {
      console.log(response);
    })
    .catch(error => console.error(error));
}

export const toServer = {
  submit: submitMessageToServer,
  roll: rollNumberOnServer,
  vote: sendVoteToServer
};