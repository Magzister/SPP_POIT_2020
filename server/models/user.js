const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../node_modules/bcrypt/bcrypt");
require("../node_modules/dotenv").config();

mongoose.connect(process.env.DB_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "MPP3" })
  .catch(error => {
    console.log(error);
  });
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", true);

const userScheme = new Schema({
  nick: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userScheme.pre("save", function (next) {
  if (this.isNew) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

userScheme.methods.validPassword = function validPassword(password, cb) {
  bcrypt.compare(password, this.password, (err, res) => {
    if (err) return cb(err, false);
    return cb(null, res);
  });
};

module.exports = mongoose.model("user", userScheme);
