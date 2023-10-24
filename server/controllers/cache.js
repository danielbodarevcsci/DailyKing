const ipCache = {};

function getStoredRoll(ip) {
    return ipCache[ip];
}

function storeRoll(ip, roll) {
    ipCache[ip] = roll;
}

function clearStoredRolls() {
    for (var ip in ipCache) {
        delete ipCache[ip];
    }
}

module.exports = {
    getStoredRoll,
    storeRoll,
    clearStoredRolls
};