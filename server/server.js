let express = require('express');
let bodyParser = require('body-parser');

let {Todo} = require('./models/todo');
let {Uset} = require('./models/user');

const port = process.env.PORT || 3000;
let app = express();
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    console.log(`Created todo: ${doc}`);
    res.send(doc);
  }, (err) => {
    console.log(`Can't save todo: ${err}`)
    res.status(400).send(err);
  });
});

app.get("/todos", (req, res) => {
  Todo.find({}).then(todoList => {
    res.send({todoList});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

let port = 3000;
app.listen(port, () => {
  console.log(`Server started on log ${port}`);
});

module.exports = {app};
