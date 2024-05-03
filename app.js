const express = require('express');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');

// init app & middleware
const app = express();
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));
app.use(express.json());

// db connection
let db;
connectToDb((err) => {
  if(!err) {
    app.listen(3000), () => {
      console.log('app listening on port 3000')
    }
    db = getDb()
  }
});

// routes
app.get('/all', (req, res) => {
  let words = [];
  db.collection('words')
    .find()
    .forEach(word => words.push(word))
    .then(() => {
      res.status(200).json(words)
    })
})

app.post('/all', (req, res) => {
  const wordObject = req.body;
  db.collection('words').insertOne(wordObject)
    .then(result => res.status(201).json(result))
    .catch((err) => res.json({error: 'from post route in app', err}))
})