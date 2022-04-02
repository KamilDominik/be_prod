const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
const mongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
let db;
mongoClient.connect('mongodb+srv://sirthoms13:Chujdupa69@cluster0.zajc9.mongodb.net',(err,client) =>{
    db = client.db('lessonstore');
})

app.use(express.json());

app.param('collectionName',(req,res,next,collectionName) =>{
    req.collection = db.collection
    (collectionName);
    return next();
});
app.get('/',(req,res,next) =>{
    res.send("Select a collection with /collection/collectionName");
});
app.get('/collection/:collectionName',(req,res,next)=>{
    console.log("incomming request for retriving collections");
    req.collection.find({}).toArray((e,results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
});
app.get('/collection/:collectionName/:sortby/:order',(req,res,next)=>
{
    console.log("incomming request for sorted data :{ " + req.params.sortby + " , " + req.params.order + " }");
    req.collection.find({},{sort:[[req.params.sortby , parseInt(req.params.order)]]})
    .toArray((e, results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
})
app.get('/collection/:collectionName/:searchTerm',(req,res,next)=>
{
    console.log("incomming request for search Term : {" + req.params.searchTerm + "}");
    var srch = req.params.searchTerm;
    req.collection.find({"subject": {"$regex": srch, "$options": 'i'}}).toArray((e,results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
})
app.post('/collection/:collectionName',(req,res,next) =>{
    console.log("Incoming POST request for : {" + req.params.collectionName + "}");
    req.collection.insert(req.body,(e,results) => {
        if(e) return next(e);
        res.send(results);
    })
})
const ObjectID = require('mongodb').ObjectID;
app.put('/collection/:collectionName/:id',(req,res,next) =>{
    console.log("Incomming PUT request for {"+ req.params.collectionName + " , " + req.params.id + " }");
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set : req.body},
        {safe:true, multi:false},
        (e,result)=>{
            if(e) return next(e);
            res.send((result.matchedCount === 1) ? {msg : 'success'} :{msg:'error'})
            console.log(result);
        })
})
app.listen(port, ()=>{
    console.log('Express is running in in (heroku)port' + port);
})
