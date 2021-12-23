//Import express model
const express = require("express");
//import student module
const User = require("../models/user");
//
const router = express.Router();
//import bcrypt
const bcrypt = require("bcrypt");
//Function that check email format
function verifyEmailFormat(email) {
  const regExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(String(email).toLowerCase());
}
//Business Logic: Add user (Signup)
router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.pwd, 10).then((cryptedPwd) => {
    const userObject = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      pwd: cryptedPwd,
      tel: req.body.tel,
      role: req.body.role,
    });
    userObject.save((err, result) => {
      if (err) {
        console.log(err);
        if (err.errors.email) {
          res.status(200).json({
            message: "Email exist",
          });
        }
      } else {
        res.status(200).json({
          message: "Added successfully",
          user: result,
        });
      }
    });
  });
});
//Business Logic: LogIn
router.post("/login", (req, res) => {
  console.log("Here into login", req.body);
  User.findOne({ email: req.body.email }).then((result) => {
    console.log("result", result);
    if (!result) {
      res.status(200).json({
        message: "Please check Email",
      });
    } else {
      console.log("result;pwd", result.pwd);
      let pwdResult = bcrypt.compare(req.body.pwd, result.pwd);
      console.log("pwdResult", pwdResult);
      pwdResult.then((status) => {
        console.log("Here status", status);
        if (status) {
          User.findOne({ email: req.body.email }).then((finalResult) => {
            let userToSend = {
              firstName: finalResult.firstName,
              lastName: finalResult.lastName,
              userID: finalResult._id,
              role: finalResult.role,
            };
            res.status(200).json({
              message: "Welcome",
              user: userToSend,
            });
          });
        } else {
          res.status(200).json({
            message: "Please check Pwd",
          });
        }
      });
    }
  });
});
//Business Logic: get all users
router.get("/", (req, res) => {
  User.find((err, docs) => {
    if (err) {
      console.log("Error with DB");
    } else {
      res.status(200).json({
        users: docs,
      });
    }
  });
});
//Business Logic: Get User By ID
router.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((result) => {
    if (result) {
      res.status(200).json({
        findedUser: result,
      });
    } else {
      res.status(200).json({
        message: "User Not Found",
      });
    }
  });
});
//Business Logic: Delete User By ID
router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }).then((result) => {
    if (result) {
      res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      res.status(200).json({
        message: "User Not Found",
      });
    }
  });
});
//Business Logic: Update User By ID
router.put("/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then((result) => {
    if (result.modifiedCount == 1) {
      res.status(200).json({
        message: "User is updated successfully",
      });
    } else {
      if (result.modifiedCount == 0 && result.matchedCount == 1) {
        res.status(200).json({
          message: "No modification",
        });
      } else {
        res.status(200).json({
          message: "User not exist",
        });
      }
    }
  });
});
//Rend router exportable
module.exports = router;
