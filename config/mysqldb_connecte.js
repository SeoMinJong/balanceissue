import { createConnection } from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const client =  createConnection({
    host     : process.env.DEV_HOST,
    user     : process.env.DEV_USER,
    password : process.env.DEV_PASSWORD,
    database : process.env.DEV_DATABASE
});

client.connect(function(err) {
    if (err) throw err;
    console.log("Mysql DB Connected!");
});

export default client;