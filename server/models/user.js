let validator = require('validator');
let jwt = require('jsonwebtoken');
let _ = require('lodash');

let {mongoose} = require('../db/mongoose.js');
let UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function(){
  let user = this;
  let userObj = user.toObject();
  return _.pick(userObj, ["email", "_id"]);
}

UserSchema.methods.generateAuthToken = function(){
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(()=>{
    return token;
  });
}

UserSchema.statics.findByToken = function(token) {
  User = this;
  let decoded;
  try{
    console.log("token: ", token);
    decoded = jwt.verify(token, 'abc123');
    console.log("decoded: ", decoded);
  } catch(e){
    console.log(e);
    return Promise.reject(e);
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

User = mongoose.model("User", UserSchema);

module.exports = {User};
