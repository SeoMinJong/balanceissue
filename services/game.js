import util from 'util';
import * as bcrypt from 'bcrypt'

/* game section function
get_gm_index - Get game random index
get_gm_data - Get game data
insert_gm_log - Record the answer selected by the user
insert_gm - Insert user create game (disable:0)
*/

export async function get_gm_index(post, client) {
    const query = util.promisify(client.query).bind(client);
    const gm_type = post.gm_type;
    const gm_19_type = post.gm_19_type;
    const prev_index = String(post.prev_index);
    var s_prev_index = prev_index.split('');
    let select_query;

    if (prev_index==''){
        select_query = gm_19_type != 0 
            ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
            : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type};`;
    }else{
        select_query = gm_19_type != 0 
            ? `SELECT IDX FROM GM_TYPE WHERE TYPE IN (${gm_type}, 4) AND IDX NOT IN (${s_prev_index}) GROUP BY IDX HAVING COUNT(DISTINCT TYPE) = 2;`
            : `SELECT IDX FROM GM_TYPE WHERE TYPE = ${gm_type} AND IDX NOT IN (${s_prev_index});`;
    }

    const idxResults = await query(select_query);
    const randomIndex = Math.floor(Math.random() * idxResults.length);
    const randomresult = idxResults[randomIndex];

    return randomresult.IDX
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

export async function insert_gm(post, client){
    const query = util.promisify(client.query).bind(client);
    if(post.nickname==""){
        post.nickname = "익명"
    }
    const gm_query = `INSERT INTO gm (NICKNAME, GM_EXPLAIN, QUESTION_A, QUESTION_B, DISABLE) values('${post.nickname}', '${post.explain}', '${post.question1}', '${post.question2}', 0);`;

    const result = await query(gm_query);

    let insertId = result.insertId

    if(post.friend=='1'){
        query(`INSERT INTO gm_type (IDX, TYPE) VALUES(${insertId}, 1)`);
    }
    if(post.family=='1'){
        query(`INSERT INTO gm_type (IDX, TYPE) VALUES(${insertId}, 2)`);
    }
    if(post.lover=='1'){
        query(`INSERT INTO gm_type (IDX, TYPE) VALUES(${insertId}, 3)`);
    }   
    if(post.adult=='1'){    
        query(`INSERT INTO gm_type (IDX, TYPE) VALUES(${insertId}, 4)`);
    }
}

export async function insert_gm_log(post, client){
    const query = util.promisify(client.query).bind(client);
    const {result_type, index} = post
    let insert_query = `INSERT INTO gm_log (GM_IDX, Sl_TYPE) VALUES(${index}, ${result_type})`;

    await query(insert_query);
}

export async function insert_report(post, client){
    console.log('start insert report')
    const query = util.promisify(client.query).bind(client);
    const {GM_IDX, NICKNAME, TYPE, REPORT} = post
    let insert_query = `INSERT INTO gm_report (GM_IDX, NICKNAME, REPORT_TYPE, REPORT) VALUES(${GM_IDX}, '${NICKNAME}', ${TYPE}, '${REPORT}')`;

    await query(insert_query, function(err, result){
        if (err){
            console.log('report insert false')
            console.log(err)
            return 0
        }
        else{
            console.log('report insert success')
            return 1
        }
    });
}

/* comment section function
comment_insert - Insert comment
comment_delete - Delete comment
*/
export async function insert_comment(post, client){
    const query = util.promisify(client.query).bind(client);
    let encryptedPassword
    if(post.password==''){
        encryptedPassword = ''
    }else{
        encryptedPassword = await encoding(post.password);
    }

    const comment_query = `INSERT INTO gm_comment (GM_IDX, COMMENT, NICKNAME, HASHED_PASSWORD) values(${post.parent_id}, '${post.comment}', '${post.nickname}', '${encryptedPassword}');`;

    await query(comment_query);
}

export async function delete_comment(post, client){
    const query = util.promisify(client.query).bind(client);
    
    const select_query = `SELECT * FROM balance.gm_comment WHERE IDX=${post.commentId};`;
    const delete_query = `DELETE FROM balance.gm_comment WHERE IDX=${post.commentId};`;

    const selectResults = await query(select_query);
    
    if(selectResults[0].HASHED_PASSWORD==post.password){
        await query(delete_query);

        return true;
    }

    const isMatch = await bcrypt.compare(post.password, selectResults[0].HASHED_PASSWORD);
    if(!isMatch) {
        return false;
    }

    await query(delete_query);
    
    return true
}



/* util section function
encoding - Password encoding
set_cookie - To connect home -> play cookie setting
*/
async function encoding(password){
    const salt = bcrypt.genSaltSync(10);
    if (!password || typeof password !== 'string') {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);

    return encryptedPassword
}

export async function set_cookie(req, res, post){
    res.cookie('gm_type', post.gm_type);
    res.cookie('gm_19_type', post.gm_19_type);
    res.cookie('prev_index', '')
}
