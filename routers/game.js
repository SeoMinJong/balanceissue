import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { set_cookie, get_gm_data, get_gm_index, comment_insert, comment_delete } from '../services/game.js'


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


// api
router.post('/api/play/', async (req, res)=>{
    const post = req.body;
    set_cookie(req, res, post);
    post['prev_index'] = ''
    const gm_index = await get_gm_index(post, client);
    
    return res.redirect(`/game/play/${gm_index}`);
})

router.post('/api/next_play/', async (req, res) => {
    const gm_index = await get_gm_index(req.cookies, client);

    res.redirect(`/game/play/${gm_index}`);
})

router.post('/api/comment_insert/', async (req, res)=>{
    await comment_insert(req.body, client);
    res.redirect(`/game/play/${req.body.parent_id}`);
})

router.delete('/api/comment/:idx', async (req, res)=>{
    const post = req.body;
    const isDelete = await comment_delete(post, client);
    
    if(isDelete){
        console.log('delete success');
        return res.send(200);
    }else{
        console.log('delete false');
        return res.send(202);
    }
})

export default router;