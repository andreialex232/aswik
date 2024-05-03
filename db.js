const { MongoClient } = require('mongodb');
let dbConnection;
const uri = "mongodb+srv://alexx:IwrAyYKhfVfp562p@cluster0.j0wq37j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
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