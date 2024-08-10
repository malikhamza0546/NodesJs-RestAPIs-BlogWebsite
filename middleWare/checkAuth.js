const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "sbs 147");
    console.log("verify", verify);
    if (verify) {
      console.log("MiddleWare Verified");
      next();
    }
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid Token",
    });
  }
};
