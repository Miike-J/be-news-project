const {selectArticleById, updateArticleById, selectArticles, selectArticleCommentsById, insertComment} = require('../Model/articles.model')

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params

    selectArticleById(article_id).then(results => {
        res.status(200).send({article: results})
    }).catch(next)
}

exports.patchArticleById = (req, res, next) => {

    const {article_id} = req.params
    const {inc_votes} = req.body

    updateArticleById(article_id, inc_votes).then(results => {
        res.status(200).send({article: results})
    }).catch(next)
}

exports.getArticles = (req, res, next) => {

    console.log('here')

    const {sort_by, order, topic} = req.query

    selectArticles(sort_by, order, topic).then(results => {
        res.status(200).send({articles: results})
    }).catch(next)
}

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params

    selectArticleCommentsById(article_id).then(results => {
        res.status(200).send({comments: results})
    }).catch(next)
}

exports.postArticleComment = (req, res, next) => {
    const {username} = req.body
    const {body} = req.body
    const {article_id} = req.params
    insertComment(username, body, article_id).then(results => {
        res.status(201).send({comment: results})
    }).catch(next)
}
