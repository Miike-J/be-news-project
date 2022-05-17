const db = require('../db/connection')

exports.selectArticleById = (article_id) => {

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(results => {
        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }
        return results.rows[0]
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(results => {

        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        } 

        const checkVotes = Math.sqrt(Math.pow(inc_votes, 2))
        if(checkVotes > results.rows[0].votes) {
            return Promise.reject({status: 400, msg: 'bad request'})
        }

        const value = results.rows[0].votes + inc_votes
        
        return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *', [value, article_id])
    }).then(results => {
        return results.rows[0]
    })
}