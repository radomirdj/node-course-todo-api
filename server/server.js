let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');

require('./config/config');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

const port = process.env.PORT;
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



//ROUTE /users
app.post("/users", (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Server started on log ${port}`);
});

module.exports = {app};
