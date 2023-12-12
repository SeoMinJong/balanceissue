import util from 'util';


import client from './config/mysqldb_connecte.js';


async function score_renewal(client){
    const query = util.promisify(client.query).bind(client);
    // gm_log 전체 불러오기
    const select_query = 'SELECT GM_IDX, SL_TYPE, COUNT(*) FROM balance.gm_log GROUP BY GM_IDX, SL_TYPE ORDER BY GM_IDX, SL_TYPE;'
    // gm_idx별로 a:b 비율 구하기
    const score_results = await query(select_query);

    
    // 비율에 따른 gm_socre에 들어갈 갱신 점수 생성하기

    // 생성된 점수 gm_score에 업데이트 해주기
}

async function test_case_insert(client, GM_IDX, SL_TYPE, count){
    const query = util.promisify(client.query).bind(client);
    
    const insert_query = `INSERT INTO gm_log(GM_IDX, SL_TYPE) VALUES(${GM_IDX}, ${SL_TYPE})`

    for (let i=0; i<count; i++){
        query(insert_query)
        console.log(`insert_query ${i} success`);
    }
}

test_case_insert(client, 4, 1, 84);

// const score_results = await score_renewal(client);
// console.log(score_results[0])
// console.log(score_results[1])