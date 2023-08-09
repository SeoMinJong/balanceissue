const sanitizeHtml = require('sanitize-html');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.use(express.static('public'));

const template_f = require('../lib/template.js');

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, '../views/home.html');
    res.sendFile(dirPath);
})

router.get('/play',function(req,res){
    // req에서 하나 이상의 선택값을 넘겨받아서 해당 선택값에 해당하는 질문들이 나올 수 있도록 해야함
    // 선택값에 대한 DB 데이터 값 받기
    var dirPath = path.join(__dirname, '../views/play.html');
    res.sendFile(dirPath);
})

router.post('/create_process', function(req, res){
    /*
    var body='';
    req.on('data', function(data){
        body = body + data;
        console.log('body : '+body);
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        
        fs.writeFile(`data/${title}`, description, 'utf-8',
        function(err){
            res.writeHead(302, {Location: `/page/${title}`});
            res.end('success');
        })
    });
    */
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