import util from 'util';
import mysql from 'mysql';
import deferred from 'deferred';


import client from './config/mysqldb_connecte.js';


async function score_renewal(client){
    const query = util.promisify(client.query).bind(client);
    // gm_log 전체 불러오기
    const select_query = 'SELECT GM_IDX, SL_TYPE, COUNT(*) as COUNT FROM balance.gm_log GROUP BY GM_IDX, SL_TYPE ORDER BY GM_IDX, SL_TYPE;'
    // gm_idx별로 a:b 비율 구하기
    const score_results = await query(select_query);
    
    // 비율에 따른 gm_socre에 들어갈 갱신 점수 생성하기
    // 1. 두개씩 짝지어진 데이터 로우를 가져와서 안의 count를 뽑아서 하나의 리스트에 모은다.
    // 2. 조건문을 통해 값을 추가시킨다.
    let score_list = [];
    console.log('score_list :')
    for (let i=0; i<score_results.length/2; i++){
        console.log('score_results[2*i].GM_IDX , score_results[2*i+1].GM_IDX',score_results[2*i].GM_IDX, score_results[2*i+1].GM_IDX)
        if (score_results[2*i].GM_IDX == score_results[2*i+1].GM_IDX){
            let score_a = Math.round(score_results[2*i].COUNT / (score_results[2*i].COUNT + score_results[2*i+1].COUNT) * 100)      // 0, 2, 4
            let score_b = 100 - score_a    // 1, 3, 5
            let gm_idx = score_results[2*i].GM_IDX
            score_list.push({SCORE_A:score_a, SCORE_B:score_b, GM_IDX:gm_idx});
            console.log(score_list)
        }
    }
    
    // let queries = '';
    // const update_query = 'UPDATE gm_score SET SCORE_A = ?, SCORE_B = ? WHERE GM_IDX = ?;';

    score_list.forEach(row => {
        let update_query = `UPDATE gm_score SET SCORE_A = ${row.SCORE_A}, SCORE_B = ${row.SCORE_B} WHERE IDX = ${row.GM_IDX}`;
        query(update_query);
    });

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

// test_case_insert(client, 4, 1, 84);

const score_results = await score_renewal(client);
console.log(score_results)