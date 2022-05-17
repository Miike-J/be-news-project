const {selectUsers} = require('../Model/users.model')

exports.getUsers = (req, res, next) => {
    selectUsers().then(results => {
        res.status(200).send({users: results})
    })
}