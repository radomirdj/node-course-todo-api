const {MongoClient} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server!!!\n", err);
  }
  console.log("Connected to MongoDB server");

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if(err){
      return console.log("Failed to insert todo document!!!\n", err);
    }

    console.log("inserted: ", JSON.stringify(result.ops, undefined, 2));
  });
  db.close();
});
