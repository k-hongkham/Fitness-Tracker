const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, password)
      VALUES($1,$2) 
    RETURNING *;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
};
