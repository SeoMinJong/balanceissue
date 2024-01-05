import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { set_cookie, get_gm_data, get_gm_index, insert_gm_log, insert_comment, delete_comment, insert_gm } from '../services/game.js'


const router = express.Router();
const __dirname = path.resolve();

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, './views/home.hbs'); 
    res.render(dirPath);
})

router.get('/play/:idx', async function(req,res){
    let prev_index = String(req.cookies.prev_index);
    const idx = String(req.params.idx);

    if (!prev_index.includes(idx)) {
        prev_index += `${idx}`;
        res.cookie('prev_index', prev_index);
    }

    let gm_data = await get_gm_data(req.params.idx, client);
    let dirPath = path.join(__dirname, './views/play.hbs'); 

    res.render(dirPath, {data:gm_data.dataResult, comments:gm_data.commentResults, score:gm_data.scoreResult});
})

router.get('/create', (req, res) => {
    var dirPath = path.join(__dirname, './views/create.hbs'); 
    res.render(dirPath);
})

router.get('/report/:idx', (req, res) => {
    var dirPath = path.join(__dirname, './views/report.hbs'); 
    const idx = req.params.idx;
    res.render(dirPath, {idx: idx});
})
/*api
post /api/play/ - Home page play game
post /api/next-play/ - Play page next game
post /api/gm-log/ - Record user's selected answer
post /api/comment/ - Insert comment
delete /api/comment/ - Delete comment
post /api/gm - Insert comment disable:0
*/
router.post('/api/play/', async (req, res)=>{
    const post = req.body;
    set_cookie(req, res, post);
    post['prev_index'] = ''
    const gm_index = await get_gm_index(post, client);
    
    return res.redirect(`/game/play/${gm_index}`);
})

router.post('/api/next-play/', async (req, res) => {
    const gm_index = await get_gm_index(req.cookies, client);

    res.redirect(`/game/play/${gm_index}`);
})

router.post('/api/gm/', async (req, res)=>{
    await insert_gm(req.body, client);
    res.send("<script>alert('감사합니다! 관리자 검토 후 문제 승인 예정입니다!');location.href='/game/create/';</script>");
})

router.post('/api/gm-log/', async (req, res)=>{
    // 클릭한 요소 넘겨받기 (0 or 1)(a or b)
    const post = req.body;

    await insert_gm_log(post, client);
})

// comment api
router.post('/api/comment/', async (req, res)=>{
    await insert_comment(req.body, client);
    res.redirect(`/game/play/${req.body.parent_id}`);
})

router.delete('/api/comment/:idx', async (req, res)=>{
    const post = req.body;
    const isDelete = await delete_comment(post, client);
    
    if(isDelete){
        return res.send(200);
    }else{
        return res.send(202);
    }
})

export default router;