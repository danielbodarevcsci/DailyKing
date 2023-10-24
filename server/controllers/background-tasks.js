import { clearStoredRolls } from './cache.js';
import { clearAllPosts } from './database.js';

const cron = require('node-cron');

cron.schedule('0 0 0 * * *', dailyReset);

async function dailyReset() {
    await clearAllPosts();
    clearStoredRolls();
    console.log("Cleared all posts and rolls!")
}