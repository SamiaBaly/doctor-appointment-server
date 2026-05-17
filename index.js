const dotenv = require("dotenv");
const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 6001;
dotenv.config();


app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://doctorAppointment:I3jvJ4pBTTImlTGT@cluster0.vb0xegb.mongodb.net/?appName=Cluster0";

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


    app.get('/appointments', async (req, res) => { 
      const cursor = appointCollection.find();
      const result = await cursor.toArray();
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
