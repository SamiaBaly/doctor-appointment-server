const dotenv = require("dotenv");
const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 6001;
dotenv.config();


app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
    await client.connect();
    const db = client.db("doctorAppointment");
    const appointCollection = db.collection("appointments");
    const bookinCollection = db.collection("booking")


    app.get('/appointments', async (req, res) => {
      const cursor = appointCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get('/appointments/:id', async (req, res) => {
      const id  = req.params.id;
      const result = await appointCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });

    app.post('/booking', async (req, res) => { 
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookinCollection.insertOne(bookingData);
      res.send(result);
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
