const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoModel = require("../module/article.js");
const validate = require("../module/joi.js")
const saltRounds = 10;

const SaveRefreshToken = [];
const authController = {
  registerUser: async (req, res,next) => {
    try {
      const { username, password, email } = req.body;

            const { error } = validate(req.body);

            console.log(error);
            if (error) {
                throw createError(error);
            }
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      // const hashed = await bcrypt.hash(req.body.password, salt);
      const newUser = await new mongoModel({
        username: username,
        email: email,
        password: hashed,
      });
      //save to db
      const user = await newUser.save();
      return res.status(200).json({
        message:"thanh cong",
        Element:user
      });
    } catch (err) {
      next(err)
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

  login: async (req, res,next) => {
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
        SaveRefreshToken.push(refreshToken);
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
     next(err)
    }
  },
  requestRefreshToken: async (req, res) => {
    const newRefreshToken = res.cookie.refreshToken;
    if (!newRefreshToken) return res.status(401).json("you are not authenticated!");
    if (!SaveRefreshToken.include(newRefreshToken)) {
      return res.status(403).json("ko phai refresn token cua user");
    }
    jwt.verify(newRefreshToken, Process.env.REFESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      const refreshTokens = SaveRefreshToken.filter((token) => token !== newRefreshToken);
      const NewAcessToken = authController.generateAccessToken(user);
      const NewRefreshToken = authController.generateRefreshToken(user);
      SaveRefreshToken.push(refreshTokens);
      res.cookie("refreshToken", NewRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        samesite: "strict",
      });
      return res.status(200).json({ accessToken: NewAcessToken });
    });
  },

  //log out
  userlogout: async (req, res, next) => {
     res.clearCookie(SaveRefreshToken);
   const token = SaveRefreshToken.filter(
      (token) => token != res.cookies.refreshToken
    );
    return res.status(200).json("log out success");
  },
};

module.exports = authController;
