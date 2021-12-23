const mongoose = require("mongoose");
courseSchema = mongoose.Schema({
  teacher: String,
  name: String,
  price: Number,
  description: String,
  duration: Number,
  img: String,
});
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
