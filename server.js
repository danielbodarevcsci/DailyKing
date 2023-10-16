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
    const city = getCity(ip);
    var cityPost = await getCityPost(city);
    res.send({
        city: city,
        message: cityPost?.message,
        roll: cityPost?.roll,
        localRoll: checkIp(ip)
    }); 
});

function getCity(ip) {
    const geo = lookup(ip);
    if (geo) {
        return geo.city;
    } else {
        return 'Not Found';
    }
}

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

async function getCityPost(city) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    const result = await collection.findOne({city:city});
    return result;
}

async function updateCityPost(cityPost) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.updateOne({_id:cityPost._id}, {$set: {message: cityPost.message, roll: cityPost.roll}});
}

async function insertCityPost(post) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.insertOne(post, 
    (err, res) => {
        if (err) throw err;
        console.log('Inserted City Post: ', message);
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
    const city = getCity(ip);
    var cityPost = await getCityPost(city);
    const roll = getRoll();
    if (!cityPost) {
        cityPost = {
            message: req.body.message,
            city: city,
            roll: roll
        }
        insertCityPost(cityPost);
    } else if (roll > cityPost.roll) {
        cityPost.roll = roll;
        cityPost.message = req.body.message;
        updateCityPost(cityPost);
    }
    rememberIp(ip, roll);
    res.json({response: 'Message received.'});
});