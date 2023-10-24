import { getStoredRoll, storeRoll } from './cache.js';
import { getIp } from './location.js';

export const rollNumber = (req, res) => {
    console.log(req.body);
    const ip = getIp(req);
    const roll = getStoredRoll(ip);
    if (!roll) {
        const newRoll = getRoll();
        storeRoll(ip, newRoll);
    }
    res.json({response: 'Message received.'});
};

function getRoll() {
    var roll = Math.random() * 10_000;
    for (var i = 0; i < 9; i++) {
        if (Math.random() < 0.3) {
            break;
        }
        roll = roll + (Math.random() * 10_000);
    }
    return Math.floor(roll);
}