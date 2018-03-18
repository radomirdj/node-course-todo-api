const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("Post /todos", () => {
  it('should create new todo', (done) => {
    let text = "Test todo text";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) =>{done(err)});
      });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.find().then((todos)=>{
            expect(todos.length).toBe(2);
            done();
          }).catch((err) =>{done(err)});
        });
      });
    });

describe("Get /todos", () => {
  it("should get todo list", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todoList.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should get user with right token", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  
  it("should return 401 if user not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
