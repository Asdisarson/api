import { JsonDB, Config } from 'node-json-db';

var db = new JsonDB(new Config("myDataBase", true, false, '/'));

module.exports = {
    getBookingCart: async function(id) {
        try {
            return await db.getData("/bookingCart/" + id);
        } catch(error) {
            console.error(error);
            return false;
        };

    },
    addBookingCart: async function(id, data) {
        await db.push("/bookingCart/" + id,{
            created: new Date(),
            data: data
        });
    }
}