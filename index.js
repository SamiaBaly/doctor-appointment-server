const dotenv = require("dotenv");
const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
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

const JWKS = createRemoteJWKSet(
  new URL(`${ process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken =async (req, res, next) => {
  const authHeader = req?.headers.authorization;
  if (!authHeader) {
    return res.status(401), json({ messege: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401). json({ messege: "Unauthorized" });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS)
    req.user = payload;
    
    next();
  } catch (error) { 
    return res.status(403).json({ messege: "Forbidden" });
  }
  
};
async function run() {
  try {
    
    // await client.connect();
    const db = client.db("doctorAppointment");
    const appointCollection = db.collection("appointments");
    const bookinCollection = db.collection("booking");

    app.get('/populars', async (req, res) => { 
      const result = await appointCollection.find().limit(4).toArray();
      res.send(result)
    })


    app.get('/appointments', verifyToken, async (req, res) => {
      const cursor = appointCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/appointments/:id', verifyToken, async (req, res) => {
      const {id}  = req.params;
      const result = await appointCollection.findOne({ _id: new ObjectId(id) })
      res.send(result);
    });

    app.post('/booking',verifyToken, async (req, res) => { 
      const bookingData = req.body;
   
      const result = await bookinCollection.insertOne(bookingData);
      res.send(result);
    })


    app.get("/booking/:userId",verifyToken, async (req, res) => { 
      const { userId } = req.params;
      const result = await bookinCollection.find({ userId }).toArray();
      res.send(result)
    })

    app.patch("/booking/:id",verifyToken, async (req, res) => { 
      const {id} = req.params
      const updateData = req.body
      const result = await bookinCollection.updateOne({ _id: new ObjectId(id) },
        { $set: updateData })
        res.send(result)
    });



    app.delete('/booking/:id',verifyToken, async(req,res)=>{
      const {id}=req.params;
      const result =await bookinCollection.deleteOne({_id:new ObjectId(id)})
      res.send(result);
    })
    
    // await client.db("admin").command({ ping: 1 });
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
