import { JsonDB, Config } from 'node-json-db';
import {getToken} from "../auth/authorization";

var db = new JsonDB(new Config("myDataBase", true, false, '/'));

module.exports = {
    Auth: async function(){
        await getToken();
    }
}