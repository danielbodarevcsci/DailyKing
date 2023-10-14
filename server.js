const port = 5000;
const { ServerApiVersion } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors());
app.use(cors());
const { lookup } = require('geoip-lite');

app.get('/', async (req, res, next) => {
    const city = getCity(req);
    const roll = getRandomNumber();
    var cityPost = await getCityPost(city);
    if (!cityPost) {
        await insertCityPost('Undefined message', roll, city);
        cityPost = {
            message: 'New user message',
            roll: roll
        };
    }
    else if (roll > cityPost.roll) {
        cityPost.message = 'Overwritten message';
        cityPost.roll = roll;
        updateCityPost(cityPost);
    }
    res.send({
        city: city,
        message: cityPost.message,
        roll: cityPost.roll,
        newroll: roll
    }); 
});

function getCity(req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = lookup(ip);
    if (geo) {
        return geo.city;
    } else {
        return 'Not Found';
    }
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

async function insertCityPost(message, roll, city) {
    const db = client.db('dailyking');
    const collection = db.collection('Posts');
    await collection.insertOne({message: message, roll: roll, city: city}, 
    (err, res) => {
        if (err) throw err;
        console.log('Inserted City Post: ', message);
    });
}

function getRandomNumber() {
    return Math.floor(Math.random() * 2500);
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
