//Import express model
const express = require("express");
//Import course module
const Event = require("../models/event");
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

//Express Router
const router = express.Router();
//Business Logic: Add Event
router.post("/", multer({ storage: storage }).single("img"), (req, res) => {
  let url = req.protocol + "://" + req.get("host");
  const eventObject = new Event({
    idTeacher: req.body.idTeacher,
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    price: req.body.price,
    img: url + "/images/" + req.file.filename,
  });
  eventObject.save((err, result) => {
    if (err) {
      res.status(200).json({
        message: "Error",
      });
    } else {
      res.status(200).json({
        message: "Event Added successfully",
      });
    }
  });
});
//Business Logic: Get All Event
router.get("/", (req, res) => {
  Event.find((err, docs) => {
    if (err) {
      console.log("Error with DB");
    } else {
      res.status(200).json({
        events: docs,
      });
    }
  });
});
//Business Logic: Get All Teacher Events
router.get("/:teacherId", (req, res) => {
  Event.find({ teacherId: req.params.teacherId }).then((result) => {
    if (result) {
      res.status(200).json({
        findedEvent: result,
      });
    } else {
      res.status(200).json({
        message: "Event not found",
      });
    }
  });
});
//Business Logic: Get Event By ID
router.get("/all/:id", (req, res) => {
  Event.findOne({ _id: req.params.id }).then((result) => {
    if (result) {
      res.status(200).json({
        message: "Here event info",
        findedEvent: result,
      });
    } else {
      res.status(200).json({
        message: "Event not founded",
      });
    }
  });
});
//Business Logic: Delete Event By ID
router.delete("/:id", (req, res) => {
  Event.deleteOne({ _id: req.params.id }).then((result) => {
    if (result.deletedCount == 1) {
      Event.find().then((events) => {
        res.status(200).json({
          events: events,
          message: `Event Deleted successfully`,
        });
      });
    } else {
      res.status(200).json({
        message: "Event not found",
      });
    }
  });
});
//Business Logic: Update Event By ID
router.put("/:id", (req, res) => {
  //console.log('Here into update Event', req.params.id);
  //console.log('Here into update Event', req.body);
  Event.updateOne({ _id: req.params.id }, req.body).then((result) => {
    //console.log('Here into update Event', result);
    if (result.modifiedCount == 1) {
      res.status(200).json({
        message: "Event update successfully",
      });
    } else {
      if (result.modifiedCount == 0 && result.matchedCount == 1) {
        res.status(200).json({
          message: "No modification",
        });
      } else {
        res.status(200).json({
          message: "Event not exist",
        });
      }
    }
  });
});

//Rend router exportable
module.exports = router;
