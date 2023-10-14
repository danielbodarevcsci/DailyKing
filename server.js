const express = require('express');
const app = express();
const port = 5000;
const { ServerApiVersion } = require('mongodb');
require('dotenv').config();

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

app.get('/posts', (req, res) => {
  const db = client.db('DailyKing');
  const collection = db.collection('Posts');
  const result = collection.find().toArray();
  console.log(result);
  res.send(result);
});

app.get('/', (req, res) => {
    res.send('Main Page');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
