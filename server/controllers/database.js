const { ServerApiVersion } = require('mongodb');
require('dotenv').config({path: "./server/.env"});

let client;
const MongoClient = require('mongodb').MongoClient;
client = new MongoClient(process.env.MONGODB, { 
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    } 
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await clearAllPosts();
        console.log("Cleared all posts.");
    } finally { }
}
run().catch(console.dir);

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

module.exports = {
    getPost,
    updatePost,
    insertPost,
    incrementThumbsUp,
    incrementThumbsDown,
    clearAllPosts
};