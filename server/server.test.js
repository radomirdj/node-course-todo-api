const expect = require('expect');
const request = require('supertest');

const {app} = require('./server');
const {Todo} = require('./models/todo');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe("Post /todo", () => {
  it('should create new todo', (done) => {
    let text = "Test todo text";

    request(app)
      .post("/todos")
      .send({text})
      //.expect(200)
      // .expect(res => {
      //   expect(res.body.text).toBe(text);
      // })
      .end((err, res) => {
        if(err) {
          done(err);
        }
        //Todo.find().then((todos)=>{
          //expect(todos.length).toBe(1);
          //expect(todos[0].text).toBe(text);
        //  done();
      //  }
      //);
      })
      .catch((err) =>{done(err)});
  });

});
