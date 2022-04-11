// require in the database adapter functions as you write them (createUser, createActivity...)
// const { } = require('./');
const client = require("./client");
const {
  createUser,
  createActivity,
  createRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
  addActivityToRoutine,
} = require("./");
//const { createUser } = require("./users");

async function dropTables() {
  // drop all tables, in the correct order
  try {
    await client.query(`
      DROP TABLE IF EXISTS routine_activities;
      DROP TABLE IF EXISTS routines;
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  // create all tables, in the correct order
  try {
    await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );
        CREATE TABLE activities (
          id SERIAL PRIMARY KEY,
          name varchar(255) UNIQUE NOT NULL,
          description TEXT NOT NULL
        );
        CREATE TABLE routines (
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          "isPublic" BOOLEAN DEFAULT false,
          name varchar(255) UNIQUE NOT NULL,
          goal TEXT NOT NULL,
          FOREIGN KEY ("creatorId") REFERENCES users(id)
          
        );
        CREATE TABLE routine_activities (
          id SERIAL PRIMARY KEY,
          "routineId" INTEGER REFERENCES routines(id),
          "activityId" INTEGER REFERENCES activities(id),
          duration INTEGER,
          count INTEGER,
          FOREIGN KEY ("routineId") REFERENCES routines(id),
      FOREIGN KEY ("activityId") REFERENCES activities(id)
          
        );
    `);
  } catch (error) {
    throw error;
  }
}

/* 
DO NOT CHANGE ANYTHING BELOW. This is default seed data, and will help you start testing, before getting to the tests. 
*/

async function createInitialUsers() {
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));
  } catch (error) {
    throw error;
  }
}
async function createInitialActivities() {
  try {
    console.log("Starting to create activities...");

    const activitiesToCreate = [
      {
        name: "wide-grip standing barbell curl",
        description: "Lift that barbell!",
      },
      {
        name: "Incline Dumbbell Hammer Curl",
        description:
          "Lie down face up on an incline bench and lift thee barbells slowly upward toward chest",
      },
      {
        name: "bench press",
        description: "Lift a safe amount, but push yourself!",
      },
      { name: "Push Ups", description: "Pretty sure you know what to do!" },
      { name: "squats", description: "Heavy lifting." },
      { name: "treadmill", description: "running" },
      { name: "stairs", description: "climb those stairs" },
    ];
    const activities = await Promise.all(
      activitiesToCreate.map(createActivity)
    );
  } catch (error) {
    throw error;
  }
}

async function createInitialRoutines() {
  try {
    const routinesToCreate = [
      {
        creatorId: 2,
        isPublic: false,
        name: "Bicep Day",
        goal: "Work the Back and Biceps.",
      },
      {
        creatorId: 1,
        isPublic: true,
        name: "Chest Day",
        goal: "To beef up the Chest and Triceps!",
      },
      {
        creatorId: 1,
        isPublic: false,
        name: "Leg Day",
        goal: "Running, stairs, squats",
      },
      {
        creatorId: 2,
        isPublic: true,
        name: "Cardio Day",
        goal: "Running, stairs. Stuff that gets your heart pumping!",
      },
    ];
    const routines = await Promise.all(
      routinesToCreate.map((routine) => createRoutine(routine))
    );
  } catch (error) {
    throw error;
  }
}

async function createInitialRoutineActivities() {
  try {
    const [bicepRoutine, chestRoutine, legRoutine, cardioRoutine] =
      await getRoutinesWithoutActivities();
    const [bicep1, bicep2, chest1, chest2, leg1, leg2, leg3] =
      await getAllActivities();

    const routineActivitiesToCreate = [
      {
        routineId: bicepRoutine.id,
        activityId: bicep1.id,
        count: 10,
        duration: 5,
      },
      {
        routineId: bicepRoutine.id,
        activityId: bicep2.id,
        count: 10,
        duration: 8,
      },
      {
        routineId: chestRoutine.id,
        activityId: chest1.id,
        count: 10,
        duration: 8,
      },
      {
        routineId: chestRoutine.id,
        activityId: chest2.id,
        count: 10,
        duration: 7,
      },
      {
        routineId: legRoutine.id,
        activityId: leg1.id,
        count: 10,
        duration: 9,
      },
      {
        routineId: legRoutine.id,
        activityId: leg2.id,
        count: 10,
        duration: 10,
      },
      {
        routineId: legRoutine.id,
        activityId: leg3.id,
        count: 10,
        duration: 7,
      },
      {
        routineId: cardioRoutine.id,
        activityId: leg2.id,
        count: 10,
        duration: 10,
      },
      {
        routineId: cardioRoutine.id,
        activityId: leg3.id,
        count: 10,
        duration: 15,
      },
    ];
    const routineActivities = await Promise.all(
      routineActivitiesToCreate.map(addActivityToRoutine)
    );
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialRoutines();
    await createInitialRoutineActivities();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
