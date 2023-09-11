const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');

const template_f = require('./lib/template.js');
const gameRouter = require('./router/game');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression())

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/game', gameRouter);


app.use(function(err, req, res, next) {
    console.log(err)
    res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.listen(port, function(){
    console.log(`Example app listening on port ${port}`)
})