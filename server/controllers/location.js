const { lookup } = require('geoip-lite');

export function getLocation(ip) {
    const geo = lookup(ip);
    if (geo) {
        return `${geo.city}, ${geo.region}`;
    } else {
        return 'Home';
    }
}

export function getIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}