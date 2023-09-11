const sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const client = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
});


client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

router.use(express.static('public'));

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, '../views/home.html');
    res.render(dirPath);
})

router.post('/api/get_gm_data/', (req, res) => {
    var post = req.body;
    
    var gm_type = post.select_type;
    var gm_19_type = post.select_19;

    console.log('gm_type, gm_19_type :',gm_type, gm_19_type)

    if (gm_19_type){
        var select_query = `SELECT IDX
        FROM GM_TYPE
        WHERE TYPE IN (${gm_type}, 4)
        GROUP BY IDX
        HAVING COUNT(DISTINCT TYPE) = 2;`
    }
    else{
        var select_query = `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`
    }


    client.query(select_query, (error, results) => {
        if (error) throw error;
         
        let randomIndex = Math.floor(Math.random() * results.length); // 랜덤 인덱스 생성

        let randomresult = results[randomIndex]; // 랜덤 값 추출
         
        console.log(randomresult.IDX)

        res.json({ index: randomresult.IDX }); 
     });
});



router.get('/play/:Index',function(req,res){
    var dirPath = path.join(__dirname, '../views/play.html');
    res.render(dirPath);
})

module.exports = router;    