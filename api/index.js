// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
require("dotenv").config();
const express = require("express");
const apiRouter = express.Router();
const healthRouter = require("./health");
const usersRouter = require("./users");
const activitiesRouter = require("./activities");
const routineActivitiesRouter = require("./routine_activities");
const routinesRouter = require("./routines");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    throw {
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    };
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});
apiRouter.use("/health", healthRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/routines", routinesRouter);
apiRouter.use("/routine_activities", routineActivitiesRouter);
module.exports = apiRouter;