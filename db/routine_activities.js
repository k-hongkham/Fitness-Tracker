const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO routine_activities ("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine(routine) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE routine_activities."routineId"=$1;
      `,
      [routine.id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
};
