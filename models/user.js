const mongoose = require("mongoose");
// const crypto = require("crypto");
const bcrypt = require("bcrypt")
const saltRounds = 10;
// const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email:{
    type: String,
    trim: true,
    required: true,
    unique: 32
  },
  password:{
    type: String,
    required: true,
  },
  about:{
    type: String,
    trim: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: []
  }
},
{timestamps: true}
);

// virtual field
// userSchema
// .virtual("password")
// .set(function(password){
//   this._password = password;
//   this.salt = uuidv1();
//   this.hashed_password = this.encryptPassword(password);
// })
//
// .get(function(){
//   return this._password;
// });

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        console.log('password changed')
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next();
            });
        });
    } else {
        next();
    };
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

// userSchema.method = {
//   authenticate: function(plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },
//   encryptPassword: function(password) {
//     if (!password) return "";
//     try {
//       return crypto
//       .createHmac("sha1", this.salt)
//       .update(password)
//       .digest("hex");
//     } catch (err){
//       return "";
//     }
//   }
// };

module.exports = mongoose.model("User", userSchema);
