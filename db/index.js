// require and re-export all files in this db directory (users, activities...)
const { dropTables, createTables } = require("./index");
const { createUser } = require("./users");
module.export = {
  createUser,
  dropTables,
  createTables,
};
