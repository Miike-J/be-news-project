const {selectArticleById} = require('../Model/articles.model')

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params

    selectArticleById(article_id).then(results => {
        res.status(200).send({article: results})
    }).catch(next)
}