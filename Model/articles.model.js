const db = require('../db/connection')

exports.selectArticleById = (article_id) => {

    return db.query(`SELECT articles.*, CAST(COUNT(comments.article_id) AS int) as comment_count
    FROM articles 
    JOIN comments 
        ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id
    `, [article_id]).then(results => {
        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }
        return results.rows[0]
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    if(!inc_votes){
        return Promise.reject({status: 400, msg: 'bad request'})
    }
    
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, article_id])
    .then(results => {

        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }

        if(results.rows[0].votes < 0) {
            return Promise.reject({status: 400, msg: 'bad request'})
        }

        return results.rows[0]
    })
}

//'SELECT * FROM articles WHERE article_id = $1'