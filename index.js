const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dygd3dy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();





        // blog collection
        const blogCollection = client.db('blogWebsite').collection('blogs');
        const saveCollection = client.db('blogWebsite').collection('singleBlog');

        // blog related api
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // singleBlog
        app.get('/singleBlog', async (req, res) => {
            console.log(req.query);
            const result = await saveCollection.find().toArray();
            res.send(result);
        })

        app.post('/singleBlog', async (req, res) => {
            const blog = req.body;
            console.log(blog);
            const result = await saveCollection.insertOne(blog);
            res.send(result);
        })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('blog is running');
})

app.listen(port, (req, res) => {
    console.log(`blog server is running in ${port}`);
})