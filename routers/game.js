import sessionStorage from 'node-sessionstorage';
import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { get_gm_data, get_gm_index } from '../services/game.js'


const router = express.Router();
// router.use(express.static('./public'));
const __dirname = path.resolve();
router.use(express.static(path.join(__dirname, 'public')))

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, './views/home.hbs');
    res.render(dirPath);
})

router.get('/play/:index', async function(req,res){
    let gm_data = await get_gm_data(req.params.index, client);
    let dirPath = path.join(__dirname, './views/play.hbs');

    res.render(dirPath, {data:gm_data.dataResult, comment:gm_data.commentResults});
})


// api
router.post('/api/get_gm_data/', async (req, res) => {
    const post = req.body;
    const gm_index = await get_gm_index(post, client);
    
    res.send({gm_index});
})


export default router;