const { user } = require("pg/lib/defaults");
const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1,$2) 
      ON CONFLICT (username) DO NOTHING
    RETURNING *;
      `,
      [username, password]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username, password,
      FROM users
      `
    );
    delete user.password;
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT id, username, password,
      FROM users,
      WHERE id = ${id}
      `
    );
    if (!user){
      return null
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
    
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
};
