const ipCache = {};

export function getStoredRoll(ip) {
    return ipCache[ip];
}

export function storeRoll(ip, roll) {
    ipCache[ip] = roll;
}

export function clearStoredRolls() {
    for (var ip in ipCache) {
        delete ipCache[ip];
    }
}