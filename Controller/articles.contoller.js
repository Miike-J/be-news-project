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
    console.log('here');

    try {
        if (!req.query) {
            throw new Error('Request query parameters are undefined.');
        }

        const { sort_by, order, topic } = req.query;

        if (!sort_by || !order || !topic) {
            throw new Error('Missing required query parameters.');
        }

        selectArticles(sort_by, order, topic)
            .then(results => {
                res.status(200).send({ articles: results });
            })
            .catch(error => {
                console.error('Error in getArticles:', error.message);
                res.status(500).send({ error: 'Internal Server Error' });
            });
    } catch (error) {
        console.error('Error in getArticles:', error.message);
        res.status(400).send({ error: 'Bad Request' });
    }
};

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
