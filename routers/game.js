import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { get_gm_data, get_gm_index, get_gm_score } from '../services/game.js'


const router = express.Router();
// router.use(express.static('./public'));
const __dirname = path.resolve();

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, './views/home.hbs');
    res.render(dirPath);
})

router.get('/play/:index', async function(req,res){
    let gm_data = await get_gm_data(req.params.index, client);
    console.log('gm_data.scoreResult :', gm_data.scoreResult)
    console.log('gm_data.data :', gm_data.dataResult)
    let dirPath = path.join(__dirname, './views/play.hbs');

    res.render(dirPath, {data:gm_data.dataResult, comments:gm_data.commentResults, score:gm_data.scoreResult});
})


// api
router.post('/api/get_gm_data/', async (req, res) => {
    const post = req.body;
    const gm_index = await get_gm_index(post, client);
    
    res.send({gm_index});
})


export default router;