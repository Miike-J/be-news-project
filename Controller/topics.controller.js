const {selectTopics} = require('../Model/topics.model')

exports.getTopics = (req, res) => {

    console.log('>>>>>>>>>>>>>>>>>>Shmere<<<<<<<<<<<<<<<<<<<<<,')

    selectTopics().then(results => {
        res.status(200).send({topics: results})
    })
}
