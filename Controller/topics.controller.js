const {selectTopics} = require('../Model/topics.model')

exports.getTopics = (req, res) => {
    selectTopics().then(results => {
        res.status(200).send({topics: results})
    })
}
