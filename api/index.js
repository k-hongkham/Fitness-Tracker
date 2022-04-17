// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users");
const activitiesRouter = require("./activities");
const routinesRouter = require("./routines");

apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "WE GOOD!!!" });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/routines", routinesRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;