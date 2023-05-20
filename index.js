const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
require("dotenv").config();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.xtgyyfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toysInfoDb = client.db("toys-hub").collection("toys-info");
    app.post("/toys-info", async (req, res) => {
      const toysInfo = req.body;
      const result = await toysInfoDb.insertOne(toysInfo);
      res.send(result);
    });
    app.get("/toys-category/:category", async (req, res) => {
      const category = req.params.category;
      const result = await toysInfoDb.find({ category: category }).toArray();
      res.send(result);
    });
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const result = await toysInfoDb.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.get("/all-toys", async (req, res) => {
      const result = await toysInfoDb.find().toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
