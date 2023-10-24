const { incrementThumbsUp, incrementThumbsDown } = require('./database');
const { getIp, getLocation } = require('./location.js');

function submitVote(req, res) {
    const ip = getIp(req);
    const location = getLocation(ip);
    if (req.body.vote == "up") {
        incrementThumbsUp(location);
    } else if (req.body.vote == "down") {
        incrementThumbsDown(location);
    }
}

module.exports = {
    submitVote
};