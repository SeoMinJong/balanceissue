import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { get_gm_data, get_gm_index, comment_insert } from '../services/game.js'


const router = express.Router();
const __dirname = path.resolve();

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, './views/home.hbs'); 
    res.render(dirPath);
})

router.get('/play/:index', async function(req,res){
    let gm_data = await get_gm_data(req.params.index, client);
    let dirPath = path.join(__dirname, './views/play.hbs'); 

    res.render(dirPath, {data:gm_data.dataResult, comments:gm_data.commentResults, score:gm_data.scoreResult});
})


// api
router.post('/api/play/', async (req, res)=>{
    const post = req.body;
    res.cookie('gm_type', post.gm_type);
    res.cookie('gm_19_type', post.gm_19_type);
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

export default router;