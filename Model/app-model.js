const db = require('../db/connection')
const { articleData } = require('../db/data/test-data')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(results => {
        return results.rows
    })
}

exports.selectArticlesById = (article_id) => {

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(results => {
        if(results.rows.length === 0){
                return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }
        return results.rows[0]
    })
}