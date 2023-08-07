const sanitizeHtml = require('sanitize-html');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const template_f = require('../lib/template.js');

router.get('/', (req, res) => {
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

router.get('/create',function(req,res){
    console.log('start create topic')
    var title = 'WEB - CREATE';

    // 유동적인 파일 
    var _list = template_f.list(req.list);
    var template = template_f.html(title, _list, `
    <form action="/topic/create_process" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
        <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
    </form>`,
    '');
    
    res.send(template);
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