const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const Litentry = new Schema({
  _id: ObjectId,
  value: String
})

module.exports = mongoose.model("Litentry", Litentry)
