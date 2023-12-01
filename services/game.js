import util from 'util';


export async function get_gm_index(data, client) {
    const query = util.promisify(client.query).bind(client);
    var gm_type = data.gm_type;
    var gm_19_type = data.gm_19_type;

    var select_query = gm_19_type 
        ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
        : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`;

    const idxResults = await query(select_query);
    let randomIndex = Math.floor(Math.random() * idxResults.length);
    let randomresult = idxResults[randomIndex];

    return 1
}

export async function get_gm_data(index, client){
    const query = util.promisify(client.query).bind(client);
    let data_query = `SELECT IDX, QUESTION_A, QUESTION_B, GM_EXPLAIN FROM GM WHERE IDX = ${index}`;

    const dataResults = await query(data_query)
    const dataResult = dataResults[0];

    let comment_query = `SELECT NICKNAME, COMMENT, CREATED_AT FROM GM_COMMENT WHERE IDX = ${index}`;
    const commentResults = await query(comment_query)

    let score_query = `SELECT SCORE_A,SCORE_B FROM GM_SCORE WHERE IDX=${index}`
    const scoreResults = await query(score_query)
    
    const scoreResult = scoreResults[0];

    return { dataResult:dataResult, commentResults:commentResults, scoreResult:scoreResult};
}

export async function comment_insert(post, client){
    const query = util.promisify(client.query).bind(client);
    let comment_query = `INSERT INTO gm_comment (IDX, COMMENT, NICKNAME, PASSWORD) values(${post.parent_id}, '${post.comment}', '${post.nickname}', '${post.password}');`;

    await query(comment_query);
}