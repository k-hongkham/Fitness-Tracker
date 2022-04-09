const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser } = require("../db");
const { JWT_SECRET } = process.env;

usersRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { username } = jwt.verify(token, JWT_SECRET);

      if (username) {
        req.user = await getUserByUsername(username);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(404);
    next({
      name: "AuthorizationHeaderError",
      message: `Authorication token must start with ${prefix}`,
    });
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  const _user = await getUserByUsername(username);
  try {
    if (_user) {
      res.status(409);
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }
    if (password.length < 8) {
      res.status(411);
      next({
        name: "Password Error",
        message: "Password must be a minimum of 8 characters",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({
        message: "Thank you for signing up!",
        token,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
