import User from "../models/user.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  // Hash password before saving new user
  try {
    const hashedPw = await bcrypt.hash(req.body.password, 10);
    const user =  new User({ email: req.body.email, password: hashedPw });

    const result = await user.save();

    res.status(200).json({
      message: "New user created successfully",
      result: result
    });
  } catch (err) {
    res.status(500).json({
      err: {
        message: "Invalid authentication credentials"
      }
    });
  }
}

export const signin = async (req, res) => {
  try {
    // Check user existence
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({
        message: "No user found"
      })
    }

    // Check password compatibility
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });

    // Server creates token
    const token = jwt.sign({
      email: user.email,
      userId: user._id
    }, process.env.JWT_KEY, { expiresIn: "1h"});

    // Send token to front end
    res.status(200).send({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({
      message: "Password doesn't match"
    });
  }
}
