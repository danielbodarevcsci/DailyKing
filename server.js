const express = require('express');
const { ServerApiVersion } = require('mongodb');
const app = express();
const port = 5000;
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}

app.get('/posts', (req, res) => {
    res.send('Text response')
});

app.get('/', (req, res) => {
  res.send('<b>Hello World!</b>')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
