//Import express model
const express = require("express");
//Import course module
const Course = require("../models/course");
//
const router = express.Router();
const multer = require("multer");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const imgName = name + "-" + Date.now() + "-crococoder-" + "." + extension;
    cb(null, imgName);
  },
});

//Business Logic: Add course
router.post("/", multer({ storage: storage }).single("img"), (req, res) => {
  //router.post("/", (req, res) => {
  let url = req.protocol + "://" + req.get("host");
  console.log("here url ", req);
  const courseObject = new Course({
    teacher: req.body.teacher,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    duration: req.body.duration,
    img: url + "/images/" + req.file.filename, //file path in server
  });
  courseObject.save((err, result) => {
    if (err) {
      console.log(err);
      res.status(200).json({
        message: "Error",
      });
    } else {
      res.status(200).json({
        message: "Added successfully",
        user: result,
      });
    }
  });
});
//Business Logic: get all courses (app.get --> pas de req.body)
router.get("/", (req, res) => {
  console.log("Hre into get all courses");
  //res: array of objects
  Course.find((err, docs) => {
    //return in docs all courses
    if (err) {
      console.log("Error with DB");
    } else {
      res.status(200).json({
        courses: docs,
      });
    }
  });
});
//Business Logic: Get Course By ID
router.get("/:id", (req, res) => {
  console.log("Hre into get courses by ID", req.params.id);
  Course.findOne({ _id: req.params.id }).then((result) => {
    console.log("Here result after find by id", result);
    if (result) {
      res.status(200).json({
        findedCourse: result,
      });
    } else {
      res.status(200).json({
        message: `Course Not found by ID=${req.params.id}`,
      });
    }
  });
});
//Business Logic: Delete Course By ID
router.delete("/:id", (req, res) => {
  console.log("Here into delete Course", req.params.id);
  Course.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("Here result after delete", result);
    if (result.deletedCount == 1) {
      Course.find().then((courses) => {
        res.status(200).json({
          courses: courses,
          message: `Course:id:${req.params.id} is deleted successfully`,
        });
      });
    } else {
      res.status(200).json({
        message: `Course:id:${req.params.id} not found`,
      });
    }
  });
});
//Business Logic: Update Course By ID
router.put("/:id", (req, res) => {
  console.log("Here into update Course", req.params.id);
  console.log("Here into update Course", req.body);
  Course.updateOne({ _id: req.params.id }, req.body).then((result) => {
    console.log("Result after update", result);
    if (result.modifiedCount == 1) {
      res.status(200).json({
        message: "Course is update successfully",
      });
    } else {
      if (result.modifiedCount == 0 && result.matchedCount == 1) {
        res.status(200).json({
          message: "No modification",
        });
      } else {
        res.status(200).json({
          message: "Course not exist",
        });
      }
    }
  });
});
//Rend router exportable
module.exports = router;
