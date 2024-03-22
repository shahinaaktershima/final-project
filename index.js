const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();
const port=process.env.PORT||5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173',
  "https://assignment-12-client-seven.vercel.app","https://assignment-12-client-1elh923xa-shahinaaktershimas-projects.vercel.app","https://assignment-12-client-git-main-shahinaaktershimas-projects.vercel.app"
  ],
  credentials: true,
}))


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfsk54e.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    await client.connect();

    const mealsCollection=client.db('finalProject').collection('meals');
    const usersCollection=client.db('finalProject').collection('users');
    const addMealsCollection=client.db('finalProject').collection('addmeal');
// meals
   app.get('/meals',async(req,res)=>{
    const result=await mealsCollection.find().toArray();
    res.send(result)
   })

   app.get('/meals/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await mealsCollection.findOne(query);
    res.send(result)
   })
   app.delete('/meals/:id',async(req,res)=>{
const id=req.params.id;
const query={_id:new ObjectId(id)}
const result=await mealsCollection.deleteOne(query);
res.send(result)
   })
// user related api
app.post('/users',async(req,res)=>{
    const user=req.body;
    const query={email:user.email}
    const existingUser=await usersCollection.findOne(query);
  if(existingUser){
    return res.send({message:'user already exists', insertedId:null})
  }
    const result=await usersCollection.insertOne(user);
    res.send(result)
})
app.get('/users',async(req,res)=>{
    const result=await usersCollection.find().toArray();
    res.send(result)
})
app.delete('/users/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=await usersCollection.deleteOne(query);
  res.send(result);
});
// for admin users setting
app.patch('/users/admin/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id: new ObjectId(id)}
  const updateDoc = {
    $set: {
      role:'admin'
    },
  };
  const result=await usersCollection.updateOne(filter,updateDoc);
  res.send(result)
})
// app.get("/users/admin/:email", async (req, res) => {
//   const email = req.params.email;
//   const query = { email: email };
//   const user = await usersCollection.findOne(query);
//   res.send(user);
// });
// upcoming meals
app.post('/addmeal',async(req,res)=>{
  const meal=req.body;
  const result=await addMealsCollection.insertOne(meal);
  res.send(result);
})
app.get('/addmeal',async(req,res)=>{
  const result=await addMealsCollection.find().toArray();
    res.send(result)
})
app.get('/addmeal/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await addMealsCollection.findOne(query);
  res.send(result)

})
app.delete('/addmeal/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await addMealsCollection.deleteOne(query);
  res.send(result)

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

app.get('/',(req,res)=>{
    res.send('final project is running')
})

app.listen(port,()=>{
    console.log(`final project is running on port ${port}`);
})