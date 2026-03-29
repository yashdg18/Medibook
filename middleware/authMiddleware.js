const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Auth failed, invalid token", success: false });
  }
};

module.exports = authMiddleware;
