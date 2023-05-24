const mongoModel = require("../module/article.js");

const userController = {
  apiUser: async (req, res) => {
    try {
      const user = await mongoModel.find({});
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  apiDeleteUser: async (req, res) => {
    try {
      // const user = await mongoModel.findByIdAndDelete(req.params.id);
      const user = await mongoModel.findById(req.params.id);

      res.status(200).json("thanh cong");
    } catch (err) {
      res.status(500).json("loi" + err);
    }
  },
};
module.exports = userController;
