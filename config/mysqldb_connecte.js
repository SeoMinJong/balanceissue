import { createConnection } from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const client =  createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
});

client.connect(function(err) {
    if (err) throw err;
    console.log("Mysql DB Connected!");
});

export default client;