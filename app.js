const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const template_f = require('./lib/template.js');
const gameRouter = require('./router/game');

const app = express()
const port = 3000


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression())

app.use('/game', gameRouter);

app.get('/', (req, res) => {
    var title = 'Balance Issue Game';

    // 유동적인 파일 
    var template = template_f.base_html(title,
        `
        <!-- Masthead-->
        <main class="masthead bg-primary text-white text-center" style="padding-top: 18rem; padding-bottom: 12rem;">
            <div class="container d-flex align-items-center flex-column">
                <a href="./play.html">
                    <button type="button" class="btn btn-outline-dark" style="font-size: 3rem;">PLAY!</button>
                </a>
                
                <!-- Icon Divider-->
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                <!-- Masthead Subheading-->
                    <div>
                        <button type="checkbox" class="btn btn-outline-success home-button home-button"autocomplete="off">친구</button>
                        <button type="checkbox" class="btn btn-outline-warning home-button home-button"autocomplete="off">가족</button>
                        <button type="checkbox" class="btn btn-outline-info home-button home-button"autocomplete="off">연인</button>
                        <!-- <button type="checkbox" class="btn btn-outline-danger home-button"autocomplete="off">19+</button> -->
                    </div>

                    <div style="padding: 2rem;">
                        <button type="button" class="btn btn-danger home-button">19 ON</button>
                        <!-- on/off btn btn-danger -->
                    </div>
            </div>
        </main>
        `);
    
    res.send(template);
})

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