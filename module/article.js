const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/account");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      minlength: 6,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      minlength: 6,
      maxlength: 30,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const mongoModel = mongoose.model("User", userSchema);
module.exports = mongoModel;
