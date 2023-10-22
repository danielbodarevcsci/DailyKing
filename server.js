const port = 5000;
const { ServerApiVersion } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());
const { lookup } = require('geoip-lite');
const cron = require('node-cron');

const ipCache = {};

cron.schedule('0 0 0 * * *', dailyReset);

async function dailyReset() {
    await clearAllPosts();
    clearStoredRolls();
    console.log("Cleared all posts and rolls!")
}

app.get('/', async (req, res) => {
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
});

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
    return Math.floor(Math.random() * 95_000);
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
        await clearAllPosts();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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

app.post('/vote', (req, res) => {
    const ip = getIp(req);
    const location = getLocation(ip);
    if (req.body.vote == "up") {
        incrementThumbsUp(location);
    } else if (req.body.vote == "down") {
        incrementThumbsDown(location);
    }
});

app.post('/submit-message', async (req, res) => {
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
});

app.post('/roll-number', (req, res) => {
    console.log(req.body);
    const ip = getIp(req);
    const roll = getStoredRoll(ip);
    if (!roll) {
        const newRoll = getRoll();
        storeRoll(ip, newRoll);
    }
    res.json({response: 'Message received.'});
});

app.post('/reset', clearStoredRolls);