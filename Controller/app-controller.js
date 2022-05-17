const {selectTopics, selectArticlesById} = require('../Model/app-model')

exports.getTopics = (req, res) => {
    selectTopics().then(results => {
        res.status(200).send({topics: results})
    })
}

exports.getArticlesById = (req, res, next) => {
    
    const {article_id} = req.params

    selectArticlesById(article_id).then(results => {
        res.status(200).send({article: results})
    }).catch(next)
}