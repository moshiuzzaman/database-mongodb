const express = require('express');
const bodyParser = require('body-parser')
const password = "Xa3hPNrdhb3yUrjG"
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId
const uri = "mongodb+srv://roseUser:Xa3hPNrdhb3yUrjG@cluster0.ki0s6.mongodb.net/roseDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const collection = client.db("roseDb").collection("products");

    app.get('/products', (req, res) => {
        collection.find({})
        .toArray((err, products) =>{
            res.send(products);
        })
    })
    app.get('/update/:id', (req, res) => {
         const id = req.params.id
        collection.find({_id : ObjectId(id)})
        .toArray((err, products) =>{
            res.send(products[0])
            
        })
    })
    app.post('/addProduct', (req, res) => {
        const product = req.body
        collection.insertOne(product)
            .then(data => res.redirect('/'))
    })
    app.patch('/updateProduct/:id', (req, res) => {
        const id = req.params.id
        collection.updateOne({_id : ObjectId(id)},
           {$set :{price: req.body.price, quantity: req.body.quantity}} 
        )
        .then(data =>res.send(data.modifiedCount>0));
    })
    app.delete('/delete/:id',(req, res) => {
        const id = req.params.id
        console.log(id);
        collection.deleteOne({_id : ObjectId(id)})
        .then(result=>res.send(result.deletedCount>0))
    })
});







app.listen(4000, () => console.log('port 3000 running'))