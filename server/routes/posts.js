const port = 5000;
const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());
import { submitVote } from '../controllers/vote.js';
import { getWinningPost, submitPost, rollNumber } from '../controllers/posts.js';

app.get('/', getWinningPost);
app.post('/vote', submitVote);
app.post('/submit-message', submitPost);
app.post('/roll-number', rollNumber);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});