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
    console.log('gm_type, gm_19_type :', gm_type, gm_19_type)
    // console.log('gm_type, gm_19_type :',gm_type, gm_19_type)

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
        
        var data_query = `SELECT QUESTION_A, QUESTION_B, GM_EXPLAIN FROM GM WHERE IDX = ${randomresult.IDX}`
        
        client.query(data_query, (error, results) => {
            if (error) throw error;

            data = results[0]

            qa = data.QUESTION_A;
            qb = data.QUESTION_B;
            exp = data.GM_EXPLAIN;

            console.log('질문', exp, 'question :',qa, ' vs ', qb)

            res.json({ index:randomresult.IDX , qa:qa, qb:qb, exp:exp });
         });
        // res.render(302, {Location: access_page});
        // res.end();
     });
});

router.get('/play/:Index',function(req,res){
    // client.query("SELECT * FROM balance.GM;", function(err, result, fields){
    //     if(err) throw err;
    //     else{
    //         var page = ejs.render(mainPage, {
    //             title: "Temporary Title",
    //             data: result,
    //         });
    //         res.send(page);
    //     }
    // });
    console.log('req.query :', req.query)
    let dirPath = path.join(__dirname, '../views/play.html');

    let data = {qa : req.query.qa, qb : req.query.qb, exp : req.query.exp}
    console.log('data :', data)
    res.render(dirPath, {data:data});
})

module.exports = router;