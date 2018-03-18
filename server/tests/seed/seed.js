const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const todos = [
  {
    text: "Test todo 1"
  },
  {
    text: "Test todo 2"
  }
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'testemail@gmail.com',
    password: 'testPassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'testemail2@gmail.com',
    password: 'testPassword',
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
    .then(()=>done());
  })
  .catch((e)=>{
    console.log(e);
    done();
  });
};

const populateUsers = (done) => {
  User.remove({}).then(()=>{
    userOne = new User(users[0]).save();
    userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(()=>done())
  .catch((e)=>{
    console.log(e);
    done();
  });;
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
