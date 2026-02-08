const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error_msg: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.MY_SECRET_TOKEN);
    req.id = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ error_msg: "Invalid token" });
  }
};

module.exports = authorize;
