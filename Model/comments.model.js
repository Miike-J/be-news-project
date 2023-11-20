const db = require('db/connection')

exports.removeComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id]).then(results => {
       if(!results.rows[0]){
           return Promise.reject({status: 404, msg: 'comment doesnt exist'})
       }
    })
}