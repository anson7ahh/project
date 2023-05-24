const jwt = require("jsonwebtoken");

const middlewearController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          res.status(403).json("loi");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("you are not authenticated");
    }
  },

  verifyadmin: (req, res, next) => {
    middlewearController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("ban ko the xoa ng dung");
      }
    });
  },
};
module.exports = middlewearController;
