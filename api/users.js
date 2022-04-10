const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
} = require("../db");
const { JWT_SECRET } = process.env;
// const JWT_SECRET = "shhh";
const { requireUser } = require("./utils");

usersRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      console.log("username -line 21", JWT_SECRET);
      const { username } = jwt.verify(token, JWT_SECRET);

      if (username) {
        req.user = await getUserByUsername(username);
        // console.log(
        //   "THIS IS WHERE REQ.USER IS DEFINED - line 30 users.js",
        //   req.user
        // );
        next();
      } else {
        res.status(409);
        next({ name: "badToken", message: "Needs an authentic token" });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(404);
    next({
      name: "AuthorizationHeaderError",
      message: `AuthoriZation token must start with ${prefix}`,
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
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// usersRouter.use((error, req, res, next) => {
//   res.send({
//     name: error.name,
//     message: error.message,
//   });
// });

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      const token = jwt.sign({ username, id: user.id }, process.env.JWT_SECRET);

      res.send({ user, token });
    }
    //THIS IS WHERE ERROR OCCURS
    else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is incorrect.",
      });
    }
  } catch ({ name, message }) {
    res.status(401);
    next({ name, message });
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  res.send(req.user);
});

usersRouter.get("/:username/routines"),
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const routine = await getPublicRoutinesByUser({ username });
      res.send(routine);
    } catch ({ name, message }) {
      next({ name, message });
    }
  };

module.exports = usersRouter;
