const {selectArticleById, updateArticleById, selectArticles, selectArticleCommentsById} = require('../Model/articles.model')

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
    selectArticles().then(results => {
        res.status(200).send({articles: results})
    })
}

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params

    selectArticleCommentsById(article_id).then(results => {
        res.status(200).send({comments: results})
    }).catch(next)
}