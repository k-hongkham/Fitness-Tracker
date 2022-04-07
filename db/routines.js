//const { getActivities } = require(".");
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}
async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE routine.id = $1
            `,
      [id]
    );
    //console.log (rows)
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routines;
      `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      
      `
    );

    const actRoutines = await attachActivitiesToRoutines(rows);

    return actRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines (){
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = $1
      `,
      [true]
    );
    const publicRoutines = await attachActivitiesToRoutines(rows);
    return publicRoutines
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser ({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username = $1  
      `,
      [username]
    );
    
    const userRoutines = await attachActivitiesToRoutines(rows);
    return userRoutines
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser ({username}){
  try {
    const {rows} = await client.query (
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username =$1 AND "isPublic" = $2
      `,
      [username, true]
    );
    const publicUserRoutines =await attachActivitiesToRoutines(rows);
    return publicUserRoutines
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser

};
