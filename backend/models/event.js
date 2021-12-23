const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
  idTeacher: String,
  name: String,
  description: String,
  date: String,
  price: Number,
  img: String,
});
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
