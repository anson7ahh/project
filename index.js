const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./router/auth.js");
const router = require("./router/auth.js");
const userRouter = require("./router/user.js");
dotenv.config();
const port = process.env.PORT;
mongoose.connect("mongodb://127.0.0.1/account").then(() => {
  console.log("Connected!");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/v1", router);
app.use("/v1/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
