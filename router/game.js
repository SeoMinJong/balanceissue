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

const template_f = require('../lib/template.js');


router.post('/api/get_gm_data/', (req, res) => {
    var post = req.body;
    console.log('post :',post);
    var gm_type = post.select_type;
    var gm_19_type = post.select_19;
    // var gm_type = path.parse(post.gm_type).base;
    // var gm_19_type = path.parse(post.gm_19_type).base;
    console.log('gm_type, gm_19_type :',gm_type,gm_19_type);
    const query = `SELECT IDX FROM GM_TYPE WHERE type = ${gm_type} AND ${gm_19_type}`; // SQL 쿼리. ? 문자열을 통해 동적으로 값을 입력
    
    // client.query(query, (error, results, fields) => {
    //     if (error) throw error;
    //     // 쿼리 실행 결과(error) 처리 코드 작성

    //     const gm_data = results[0]; // 결과 데이터가 존재한다면, 첫번째 행(row)의 데이터 값을 가져옴.
    //     console.log(gm_data)

    //     // 
    // });
});

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, '../views/home.html');
    res.render(dirPath);
})


router.get('/play/:Index',function(req,res){
    var dirPath = path.join(__dirname, '../views/play.html');
    res.render(dirPath);
})

router.get('/create',function(req,res){
    // req에서 하나 이상의 선택값을 넘겨받아서 해당 선택값에 해당하는 질문들이 나올 수 있도록 해야함
    // 선택값에 대한 DB 데이터 값 받기
    var dirPath = path.join(__dirname, '../views/create.html');
    res.sendFile(dirPath);
})

router.post('/create_process', function(req, res){
    var post = req.body;
    var title = post.title;
    var description = post.description;
    
    fs.writeFile(`data/${title}`, description, 'utf-8',
    function(err){
        res.writeHead(302, {Location: `/topic/${title}`});
        res.end('success');
    })
    
});

router.post('/delete_process', function(req, res){
    /*
    var body='';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredID = path.parse(id).base;

        fs.unlink(`data/${filteredID}`, function(err){
            res.writeHead(302, {Location: `/`});
            res.end();
        })
    })
    */
    var post = req.body;
    var id = post.id;
    var filteredID = path.parse(id).base;

    fs.unlink(`data/${filteredID}`, function(err){
        res.writeHead(302, {Location: `/`});
        res.end();
    })
})

router.get('/update/:pageId', function(req, res, next){
    // 유동적인 파일 목록 리스트
    var filteredID = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredID}`, 'utf-8', function (err, description) {
            var title = req.params.pageId;
            var _list = template_f.list(req.list);
            var template = template_f.html(title, _list, 
                `
                <form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>`, 
                `<a href="/create">create</a>  <a href="/topic/update/${title}">update</a>`);
            res.send(template);
        });
})

router.post('/update_process', function(req, res){
    /*
    var body='';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;

        console.log()

        fs.rename(`data/${id}`, `data/${title}`, function(err){
            fs.writeFile(`data/${title}`, description, 'utf-8',
            function(err){
                res.writeHead(302, {Location: `/page/${title}`});
                res.end('success');
            })
        })
    })
    */
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;

    console.log()

    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf-8',
        function(err){
            res.writeHead(302, {Location: `/topic/${title}`});
            res.end('success');
        })
    })
})


router.get('/:pageId', function(req, res, next){
        const filteredID = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredID}`, 'utf-8', function (err, description) {
            if (err){
                next(err);
            } else{
            var sanitizedTitle = sanitizeHtml(req.params.pageId);
            var sanitizedDesscription = sanitizeHtml(description,{
                allowedTags:['h1']
            });
            var _list = template_f.list(req.list);
            var template = template_f.html(sanitizedTitle, _list, 
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDesscription}</p>`, 
                `<a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>  
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`);
                
            res.send(template);
    }})
    
});

module.exports = router;