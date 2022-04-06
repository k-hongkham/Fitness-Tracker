const client = require("./client");

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT *
        FROM activities
        WHERE id=$1 
      `,
      [activity]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivities() {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
            SELECT *
            FROM activities
      `
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query();
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById,
  getActivities,
};
