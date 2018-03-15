let validator = require('validator');
let jwt = require('jsonwebtoken');
let _ = require('lodash');
let bcrypt = require('bcryptjs');

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

UserSchema.pre('save', function(next){
  let user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hash)=> {
        user.password = hash;
        next();
      });
    });
  } else{
    next();
  }
});

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

UserSchema.statics.findByCredentalias = function(email, password) {
  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject("Can't find user");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(err) {
          return reject(err);
        }
        if(!res) {
          return reject();
        }
        return resolve(user);
      });
    });
    // bcrypt.compare(password, user.password, (err, res) => {
    //   if(!res) {
    //     return Promise.reject();
    //   }
    //   return Promise.resolve();
    // });
  });
};

User = mongoose.model("User", UserSchema);

module.exports = {User};
