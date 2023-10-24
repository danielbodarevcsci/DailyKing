const { lookup } = require('geoip-lite');

function getLocation(ip) {
    const geo = lookup(ip);
    if (geo) {
        return `${geo.city}, ${geo.region}`;
    } else {
        return 'Home';
    }
}

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

module.exports = {
    getLocation,
    getIp
};