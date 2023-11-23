import { engine } from 'express-handlebars';
import compression from  'compression'; 
import bodyParser from 'body-parser';
import express from  'express';
import path from 'path';
import fs from 'fs';

import gameRouter from './routers/game.js'

const app = express()
const port = 3000


app.engine('hbs', engine());

const __dirname = path.resolve();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression())

app.use('/game', gameRouter);

// app.use(function(err, req, res, next) {
//     console.log(err)
//     res.status(404).send('없는 페이지로 들어오셨어요...');
// });

// app.use(function(err, req, res, next) {
//     console.error(err);
//     res.status(500).send('Something broke!');
// });

app.listen(port, function(){
    console.log(`Example app listening on port ${port}`)
})