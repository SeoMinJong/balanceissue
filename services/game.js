import util from 'util';
import * as bcrypt from 'bcrypt'


async function encoding(password){
    const salt = bcrypt.genSaltSync(10);
    if (!password || typeof password !== 'string') {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);

    return encryptedPassword
}

export async function get_gm_index(data, client) {
    const query = util.promisify(client.query).bind(client);
    const gm_type = data.gm_type;
    const gm_19_type = data.gm_19_type;

    const select_query = gm_19_type 
        ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
        : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type}`;

    const idxResults = await query(select_query);
    const randomIndex = Math.floor(Math.random() * idxResults.length);
    const randomresult = idxResults[randomIndex];

    return 1
}

export async function get_gm_data(index, client){
    const query = util.promisify(client.query).bind(client);
    const data_query = `SELECT IDX, QUESTION_A, QUESTION_B, GM_EXPLAIN FROM GM WHERE IDX = ${index}`;

    const dataResults = await query(data_query);
    const dataResult = dataResults[0];

    const comment_query = `SELECT IDX ,NICKNAME, COMMENT, CREATED_AT FROM GM_COMMENT WHERE GM_IDX = ${index}`;
    const commentResults = await query(comment_query);

    const score_query = `SELECT SCORE_A,SCORE_B FROM GM_SCORE WHERE IDX=${index}`;
    const scoreResults = await query(score_query);
    
    const scoreResult = scoreResults[0];

    return { dataResult:dataResult, commentResults:commentResults, scoreResult:scoreResult};
}

export async function comment_insert(post, client){
    const query = util.promisify(client.query).bind(client);

    const encryptedPassword = await encoding(post.password);
    const comment_query = `INSERT INTO gm_comment (GM_IDX, COMMENT, NICKNAME, HASHED_PASSWORD) values(${post.parent_id}, '${post.comment}', '${post.nickname}', '${encryptedPassword}');`;

    await query(comment_query);
}

export async function comment_delete(post, client){
    const query = util.promisify(client.query).bind(client);
    
    const select_query = `SELECT * FROM balance.gm_comment WHERE IDX=${post.commentId};`;
    const delete_query = `DELETE FROM balance.gm_comment WHERE IDX=${post.commentId};`;

    const selectResults = await query(select_query);
    console.log(selectResults)
    
    const isMatch = await bcrypt.compare(post.password, selectResults[0].HASHED_PASSWORD);

    if(!isMatch) {
        console.log('Passwords do not match');
        return false;
    }

    await query(delete_query);
    
    return true
}