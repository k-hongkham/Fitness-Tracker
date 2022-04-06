const client = require("./client");

async function getRoutineById (id){
    try {
        const {
            rows: [routine],
        } = await client.query(
            `
            SELECT *
            FROM routines
            WHERE id=$1
            `,
            [routine]
        );
        return routine;
    } catch (error) {
        throw error;
        
    }
}







module.exports ={

}