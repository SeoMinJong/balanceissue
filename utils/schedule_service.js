import util from 'util';
import client from '../config/mysqldb_connecte.js';
import{score_correction} from './score_correction.js'

export async function score_renewal(){
    const query = util.promisify(client.query).bind(client);
    
    const select_query = 'SELECT GM_IDX, SL_TYPE, COUNT(*) as COUNT FROM balance.gm_log GROUP BY GM_IDX, SL_TYPE ORDER BY GM_IDX, SL_TYPE;'
    const score_results = await query(select_query);
    
    let score_list = [];
    
    for (let i=0; i<score_results.length/2; i++){
        console.log('score_results[2*i].GM_IDX , score_results[2*i+1].GM_IDX',score_results[2*i].GM_IDX, score_results[2*i+1].GM_IDX)
        if (score_results[2*i].GM_IDX == score_results[2*i+1].GM_IDX){
            // 실제 스코어 적용
            let score_a = Math.round(score_results[2*i].COUNT / (score_results[2*i].COUNT + score_results[2*i+1].COUNT) * 100)      // 0, 2, 4
            let score_b = 100 - score_a    // 1, 3, 5
            let gm_idx = score_results[2*i].GM_IDX
            
            // 점수 보정 알고리즘 적용
            let corr_scores = await score_correction({score_a:score_a, score_b:score_b})

            score_list.push({SCORE_A:corr_scores.SCORE_A, SCORE_B:corr_scores.SCORE_B, GM_IDX:gm_idx});
        }
    }

    // 생성된 점수 gm_score에 업데이트 해주기
    score_list.forEach(row => {
        let update_query = `UPDATE gm_score SET SCORE_A = ${row.SCORE_A}, SCORE_B = ${row.SCORE_B} WHERE IDX = ${row.GM_IDX}`;
        query(update_query);
    });
}