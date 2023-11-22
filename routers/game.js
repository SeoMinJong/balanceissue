import express from 'express';
import path from 'path';

import client from '../config/mysqldb_connecte.js';
import { get_gm_data } from '../services/game.js'


const router = express.Router();
// router.use(express.static('./public'));
const __dirname = path.resolve();
router.use(express.static(path.join(__dirname, 'public')))

router.get('/', (req, res) => {
    var dirPath = path.join(__dirname, './views/home.hbs');
    res.render(dirPath);
})

router.post('/play/:Index',function(req,res){
    console.log('req.query :', req.query)
    let dirPath = path.join(__dirname, './views/play.hbs');

    let data = {qa : req.query.qa, qb : req.query.qb, exp : req.query.exp}
    console.log('data :', data)
    res.render(dirPath, {data:data});
})


// api
router.post('/api/get_gm_data/', async (req, res) => {
    console.log('api get_gm_data start')
    console.log(req.body)
    const post = req.body;
    const gm_data = await get_gm_data(post, client)
    res.json(gm_data)
})


export default router;