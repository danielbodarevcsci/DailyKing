import { getPost, insertPost, updatePost } from './database.js';
import { getIp, getLocation } from './location.js';
import { getStoredRoll } from './cache.js';

export const getWinningPost = async (req, res) => {
    const ip = getIp(req);
    const location = getLocation(ip);
    var post = await getPost(location);
    res.send({
        location: location,
        message: post?.message,
        roll: post?.roll,
        thumbsup: post?.thumbsup,
        thumbsdown: post?.thumbsdown,
        localRoll: getStoredRoll(ip)
    }); 
};

export const submitPost = async (req, res) => {
    console.log(req.body);
    const ip = getIp(req);
    const ipRoll = getStoredRoll(ip);
    if (!ipRoll) {
        return;
    }
    const location = getLocation(ip);
    var post = await getPost(location);
    if (!post) {
        post = {
            message: req.body.message,
            location: location,
            roll: ipRoll
        };
        await insertPost(post);
    } else if (ipRoll > post.roll) {
        post.roll = ipRoll;
        post.message = req.body.message;
        await updatePost(post);
    }
    res.json({response: 'Message received.'});
};