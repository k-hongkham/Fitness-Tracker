const express = require ("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {getUserByUsername, createUser} = require("../db");

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
      } else if (password.length < 8) {
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
          user,
          token,
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  module.exports = usersRouter