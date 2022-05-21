import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_token");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid authorization token"});
  }
};
