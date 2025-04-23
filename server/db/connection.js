import '../loadEnvironment.js'

import { MongoClient } from "mongodb";

const CONNECTION_STRING = process.env.MONGO_URI || "";

const CLIENT = new MongoClient(CONNECTION_STRING);

let CONN;
try {
    CONN = await CLIENT.connect();
} catch(e) {
    console.error(e);
}

let db = CONN.db("Module09-10");

export default db;