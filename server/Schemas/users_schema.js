var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  password: String,
  userRole: String,
});

module.exports.userSchema = userSchema;
