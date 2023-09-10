require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/user");
const groupRouter = require("./routes/group");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("<h1>Group Chat Web Service</h1>");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, usersRouter);
app.use("/api/v1/groups", authenticateUser, groupRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5200;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

//uncomment function below to add admin user
// const User = require("./models/User");
// const addAdminUser = async () => {
//   let obj = {
//     name: "Admin",
//     email: "admin@gmail.com",
//     password: "TestAdmin1@",
//     role: "admin",
//   };
//   await User.create(obj);
// };
// addAdminUser();
