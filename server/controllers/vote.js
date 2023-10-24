export const submitVote = (req, res) => {
    const ip = getIp(req);
    const location = getLocation(ip);
    if (req.body.vote == "up") {
        incrementThumbsUp(location);
    } else if (req.body.vote == "down") {
        incrementThumbsDown(location);
    }
};