const db = require('../db/connection')
const { articleData } = require('../db/data/test-data')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(results => {
        return results.rows
    })
}

exports.selectArticlesById = (article_id) => {

    if(/\D/.test(article_id)){
        return Promise.reject({status: 400, msg: 'bad request'})
    }

    if(article_id > articleData.length) {
        return Promise.reject({status: 404, msg: 'article doesnt exist'})
    }

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(results => {
        return results.rows[0]
    })
}