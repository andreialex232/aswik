const { MongoClient } = require('mongodb');
let dbConnection;
const uriGuest = "mongodb+srv://guestguest:guestguest@cluster0.j0wq37j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uriGuest)
      .then((client) => {
        dbConnection = client.db("Allaord");
        return cb();
      })
      .catch(err => {
        console.log(err);
        return cb(err);
      })
  },
  getDb: () => dbConnection
}