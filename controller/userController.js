const mongoModel = require("../module/article.js");

const userController = {
  apiUser: async (req, res,next) => {
    try {
      const user = await mongoModel.find({});
      return res.status(200).json(user);
    } catch (err) {
      next(err)
    }
  },

  apiDeleteUser: async (req, res,next) => {
    try {
      // const user = await mongoModel.findByIdAndDelete(req.params.id);
      const user = await mongoModel.findById(req.params.id);

      return res.status(200).json("thanh cong");
    } catch (err) {
      next(err)
    }
  },
};
module.exports = userController;
