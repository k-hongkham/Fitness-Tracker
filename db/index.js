// require and re-export all files in this db directory (users, activities...)

const { createUser } = require("./users");
module.export = {
  createUser,
};
