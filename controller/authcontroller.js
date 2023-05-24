const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoModel = require("../module/article.js");

const saltRounds = 10;

let refreshTOkens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(req.body.password, salt);
      // const hashed = await bcrypt.hash(req.body.password, salt);
      const newUser = await new mongoModel({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      //save to db
      const user = await newUser.save();
      return res.status(200).json("thành công");
    } catch (err) {
      res.status(500).json("loi" + err);
    }
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        _id: user.id,
        admin: user.admin,
      },
      process.env.REFESH_KEY,
      { expiresIn: "365d" }
    );
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        _id: user.id,
        admin: user.admin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30s" }
    );
  },

  login: async (req, res) => {
    try {
      const user = await mongoModel.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("user not found");
      }
      const validpassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validpassword) {
        return res.status(401).json("invalid password");
      }
      if (user && validpassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTOkens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          samesite: "strict",
        });
        const { password, ...other } = user._doc;
        res.status(200).json({ user, accessToken });
      }
    } catch (err) {
      res.status(500).json("loi" + err);
    }
  },
  requestRefreshToken: async (req, res) => {
    const RefreshToken = res.cookie.refreshToken;
    if (!refreshToken) return res.status(401).json("you are not authenticated");
    if (!refreshTOkens.include(refreshToken)) {
      res.status(403).json("ko phai refresn token cua t");
    }
    jwt.verify(refreshToken, Process.env.REFESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTOkens.filter((token) => token !== refreshToken);
      const newAcessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTOkens.push(refreshTokens);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        samesite: "strict",
      });
      res.status(200).json({ accessToken: newAcessToken });
    });
  },

  //log out
  userlogout: async (req, res, next) => {
    res.clearCookie(refreshToken);
    refreshtoken = refreshTOkens.filter(
      (token) => token != res.cookies.refreshToken
    );
    res.status(200).json("log out success");
  },
};

module.exports = authController;
