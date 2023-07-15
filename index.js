const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const createError = require('http-errors')
const authRouter = require("./router/auth.js");
const client = require("./module/redis.js");
const userRouter = require("./router/user.js");
dotenv.config();
const port = process.env.PORT;
mongoose.connect("mongodb://127.0.0.1/account").then(() => {
  console.log("Connected!");
});
client.on("connect",()=>{
  console.log("Connected!");
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/v1", authRouter);
app.use("/v1/user", userRouter);


app.use((req, res, next) => {
    next(createError.NotFound('ko tim thay router'));
});

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
