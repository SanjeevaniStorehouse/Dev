const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  requesteditem: {
    type: String,
    required: true,
  },
  requesttype: {
    type: String,
    required: true,
  },
  appovermatrix: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  Status: {
    type: String,
  },
  approvedby: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Requests = mongoose.model("requests", RequestSchema);
