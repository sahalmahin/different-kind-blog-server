const express = require('express');
const cors = require('cors');
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
        const addCollection = client.db('blogWebsite').collection('addBlog');
        const addComment = client.db('blogWebsite').collection('users');

        // comment related api
        app.get('/users', async(req,res)=>{
            const cursor = addComment.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await addComment.insertOne(user);
            res.send(result)
        })

        // blog related api
        app.get('/blogs', async (req, res) => {
            console.log(req.query);
            const result = await blogCollection.find().toArray();
            res.send(result);
        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedBlog = req.body;
            const blog = {
                $set: {
                    title: updatedBlog.title,
                    image: updatedBlog.image,
                    description: updatedBlog.description,
                    longDescription: updatedBlog.longDescription,
                    category: updatedBlog.category,
                }
            }
            const result = await blogCollection.updateOne(filter, blog, options);
            res.send(result);
        })

        // singleBlog
        app.get('/singleBlog', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await saveCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/singleBlog', async (req, res) => {
            const blog = req.body;
            console.log(blog);
            const result = await saveCollection.insertOne(blog);
            res.send(result);
        })

        app.delete('/singleBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await saveCollection.deleteOne(query);
            res.send(result);
        })

        // addBlog
        app.get('/addBlog', async (req, res) => {
            const cursor = addCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addCollection.findOne(query);
            res.send(result);
        })

        app.post('/addBlog', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog);
            const result = await addCollection.insertOne(newBlog);
            res.send(result);
        })

        app.put('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedBlog = req.body;
            const blog = {
                $set: {
                    title: updatedBlog.title,
                    image: updatedBlog.image,
                    description: updatedBlog.description,
                    longDescription: updatedBlog.longDescription,
                    category: updatedBlog.category,
                }
            }
            const result = await addCollection.updateOne(filter, blog, options);
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