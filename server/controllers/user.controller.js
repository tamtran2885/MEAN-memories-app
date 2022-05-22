import User from "../models/user.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = (req, res, next) => {
  // Hash password before saving
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(200).json({
            message: "New user created successfully",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: {
              message: "Invalid authentication credentials"
            }
          });
        })
    });
}

export const signin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      // console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "No user found"
        })
      }

      fetchedUser = user;

      // Check password compatibility
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      // console.log(result);
      if (!result) {
        return res.status(401).json({
          message: "Failed Authentication"
        })
      }

      // Server creates token
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, process.env.JWT_KEY, { expiresIn: "1h"});

      // console.log(token);

      // Send token to front end
      res.status(200).send({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Password mismatch"
      });
    });
}
