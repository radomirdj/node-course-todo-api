let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');

require('./config/config');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authentificate} = require('./middleware/authenticate');

const port = process.env.PORT;
let app = express();
app.use(bodyParser.json());

app.post("/todos", async (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });
  try {
    let doc = await todo.save();
    res.send(doc);
  } catch(err) {
    console.log(`Can't save todo: ${err}`)
    res.status(400).send(err);
  }
});

app.get("/todos", async (req, res) => {
  try {
    let todoList = await Todo.find({});
    res.send({todoList});
  } catch(e) {
    res.status(400).send(err);
  }
});

//ROUTE /users
app.post("/users", async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);
  try {
    await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(err);
  }
});

app.get("/users/me", authentificate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  try {
    let user = await User.findByCredentalias(body.email, body.password);
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Server started on log ${port}`);
});

module.exports = {app};
