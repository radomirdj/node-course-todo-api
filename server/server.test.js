const expect = require('expect');
const request = require('supertest');

const {app} = require('./server');
const {Todo} = require('./models/todo');

const todos = [
  {
    text: "Test todo 1"
  },
  {
    text: "Test todo 2"
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
    .then(()=>done());
  })
  .catch((e)=>{
    console.log(e);
    done();
  });
});

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
