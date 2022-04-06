//const { getActivities } = require(".");
const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows,
    } = await client.query(
      `
            SELECT id, name 
            FROM routines
            WHERE routine.id = $1
            `,
      [id]
    );
    //console.log (rows)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `
            SELECT "creatorId", "isPublic", name, goal 
            FROM routines
            `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
};
