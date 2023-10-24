const { ServerApiVersion } = require('mongodb');
require('dotenv').config({path: "./server/.env"});
const { lookup } = require('geoip-lite');
const cron = require('node-cron');

const ipCache = {};

cron.schedule('0 0 0 * * *', dailyReset);

async function dailyReset() {
    await clearAllPosts();
    clearStoredRolls();
    console.log("Cleared all posts and rolls!")
}

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

async function getPost(location) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    const result = await collection.findOne({location:location});
    return result;
}

async function updatePost(post) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.updateOne({_id:post._id}, {$set: {message: post.message, roll: post.roll}});
}

async function insertPost(post) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.insertOne(post, 
    (err, res) => {
        if (err) throw err;
        console.log('Inserted Post: ', message);
    });
}

async function incrementThumbsUp(location) {
    if (!location) {
        return;
    }
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    collection.updateOne({location : location}, {$inc: { thumbsup: 1 }});
}

async function incrementThumbsDown(location) {
    if (!location) {
        return;
    }
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    collection.updateOne({location : location}, {$inc: { thumbsdown: 1 }});
}

async function clearAllPosts() {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.deleteMany({});
}

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

let client;
const MongoClient = require('mongodb').MongoClient;
client = new MongoClient(process.env.MONGODB, { 
    serverApi: {
        version: ServerApiVersion.v1,
        strict:true,
        deprecationErrors: true
    } 
});

run().catch(console.dir);

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await clearAllPosts();
        console.log("Cleared all posts.");
    } finally { }
}

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