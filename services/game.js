import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import util from 'util';

export async function get_gm_data(data, client) {
    const query = util.promisify(client.query).bind(client);

    var gm_type = data.select_type;
    var gm_19_type = data.select_19;

    var select_query = gm_19_type 
        ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
        : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`;

        console.log('select_query :',select_query)
    const results = await query(select_query);
    let randomIndex = Math.floor(Math.random() * results.length);
    let randomresult = results[randomIndex];
    console.log(randomresult)

    var data_query = `SELECT QUESTION_A, QUESTION_B, GM_EXPLAIN FROM GM WHERE IDX = ${randomresult.IDX}`;

    const dataResults = await query(data_query)

    console.log(dataResults)

    const dataResult = dataResults[0];

    const qa = dataResult.QUESTION_A;
    const qb = dataResult.QUESTION_B;
    const exp = dataResult.GM_EXPLAIN;

    return { index:randomresult.IDX , qa:qa, qb:qb, exp:exp };
}


// export async function get_gm_data(data, client){
//     var gm_type = data.select_type;
//     var gm_19_type = data.select_19;
//     // console.log('gm_type, gm_19_type :',gm_type, gm_19_type)


//     var select_query = gm_19_type 
//     ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
//     : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`;

//     // if (gm_19_type){
//     //     var select_query = `SELECT IDX
//     //     FROM GM_TYPE
//     //     WHERE TYPE IN (${gm_type}, 4)
//     //     GROUP BY IDX
//     //     HAVING COUNT(DISTINCT TYPE) = 2;`
//     // }
//     // else{
//     //     var select_query = `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`
//     // }

//     const result = await client.query(select_query, (error, results) => {
//         if (error) throw error;

//         let randomIndex = Math.floor(Math.random() * results.length); // 랜덤 인덱스 생성

//         let randomresult = results[randomIndex]; // 랜덤 값 추출
        
//         var data_query = `SELECT QUESTION_A, QUESTION_B, GM_EXPLAIN FROM GM WHERE IDX = ${randomresult.IDX}`
//     });

//     const dataResults = await new Promise((resolve, reject) => {
//         client.query(data_query, (error, results) => {
//             if (error) reject(error);
//             else resolve(results);
//         });
//     });

//     const data = dataResults[0];

//     const qa = data.QUESTION_A;
//     const qb = data.QUESTION_B;
//     const exp = data.GM_EXPLAIN;

//     console.log('질문    :', exp, 'question :',qa, ' vs ', qb)

//      return { index:randomresult.IDX , qa:qa, qb:qb, exp:exp };
     
// }