const router = require("express").Router();
const middlewearController = require("../controller/middlewear.js");
const userController = require("../controller/userController.js");

router.get("/", middlewearController.verifyToken, userController.apiUser);

//delete
router.delete(
  "/:id",
  middlewearController.verifyadmin,
  userController.apiDeleteUser
);

module.exports = router;
