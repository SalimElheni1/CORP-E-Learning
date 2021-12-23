//Import express module
const express = require("express");
//Creat express application
const app = express();
//Import path module
const path = require("path");
app.use("/images", express.static(path.join("backend/images")));

//Import mongoose module
const mongoose = require("mongoose");
//Import body-parser
const bodyParser = require("body-parser");
//Import routes
const courseRoute = require("./routes/course-routes");
const userRoute = require("./routes/user-routes");
const eventRoute = require("./routes/event-routes");
const weatherRoute = require("./routes/weather-routes");

//Use bodyParser
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
//Connect app to MongoDB
mongoose.connect("mongodb://localhost:27017/corpDB");
// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );
  next();
});
//Use routes
app.use("/api/weather", weatherRoute);
app.use("/api/events", eventRoute);
app.use("/api/courses", courseRoute);
app.use("/api/users", userRoute);
//Rend app exportable
module.exports = app;
