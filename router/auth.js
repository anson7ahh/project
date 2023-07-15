const router = require("express").Router();

const authController = require("../controller/authcontroller");
const middlewearController = require("../controller/middlewear");

router.post("/dangki", authController.registerUser);
//login
router.post("/login", authController.login);
//refresh
router.post("/refresh", authController.requestRefreshToken);

//log out
router.post(
  "/logout",
  middlewearController.verifyToken,
  authController.userlogout
);
module.exports = router;
