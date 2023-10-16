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

const ipCache = {};

app.get('/', async (req, res) => {
    const ip = getIp(req);
    const location = getLocation(ip);
    var post = await getPost(location);
    res.send({
        location: location,
        message: post?.message,
        roll: post?.roll,
        localRoll: checkIp(ip)
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
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function checkIp(ip) {
    return ipCache[ip];
}

function rememberIp(ip, roll) {
    ipCache[ip] = roll;
}

app.post('/submit-message', async (req, res) => {
    console.log(req.body);
    const ip = getIp(req);
    const location = getLocation(ip);
    var post = await getPost(location);
    const roll = getRoll();
    if (!post) {
        post = {
            message: req.body.message,
            location: location,
            roll: roll
        }
        insertPost(post);
    } else if (roll > post.roll) {
        post.roll = roll;
        post.message = req.body.message;
        updatePost(post);
    }
    rememberIp(ip, roll);
    res.json({response: 'Message received.'});
});