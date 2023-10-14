const express = require('express');
const { ServerApiVersion } = require('mongodb');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('<b>Hello World!</b>')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dailykingadmin:1321@cluster0.hl4wsj4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { 
    serverApi: {
        version: ServerApiVersion.v1,
        strict:true,
        deprecationErrors: true
    } 
});

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
run().catch(console.dir);

app.get('/posts', (req, res) => {
    res.send('Text response')
});
