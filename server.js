const port = 5000;
const { ServerApiVersion } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { lookup } = require('geoip-lite');

app.use(cors());

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

app.get('/posts', async (req, res) => {
  const db = client.db('dailyking');
  const collection = db.collection('Posts');
  const result = await collection.find().toArray();
  res.send(result);
});

app.get('/', (req, res) => {
    res.send('Main Page');
});

app.get('/location', (req, res) => {
    const ip = '2601:204:cc01:b7c0:51b4:d617:d404:ab66';
    const geo = lookup(ip);
    if (geo) {
        res.send({ 'city': geo.city });
    } else {
        res.send({ 'city': 'not found' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
