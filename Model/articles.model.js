const db = require('../db/connection')

exports.selectArticleById = (article_id) => {

    return db.query(`SELECT articles.*, CAST(COUNT(comments.article_id) AS int) as comment_count
    FROM articles 
    LEFT JOIN comments 
        ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id
    `, [article_id]).then(results => {
        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }
        return results.rows[0]
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    if(!inc_votes){
        return Promise.reject({status: 400, msg: 'bad request'})
    }
    
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, article_id])
    .then(results => {

        if(results.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article doesnt exist'})
        }

        if(results.rows[0].votes < 0) {
            return Promise.reject({status: 400, msg: 'bad request'})
        }

        return results.rows[0]
    })
}

exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const validSortBy = ['created_at', 'author', 'title', 'article_id', 'topic', 'votes', 'comment_count'];
  
    let qryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) as comment_count 
      FROM articles 
      LEFT JOIN comments 
          ON articles.article_id = comments.article_id`;
    const qryValues = [];
  
    if (topic) {
      qryStr += ` WHERE articles.topic = $1`;
      qryValues.push(topic);
    }
  
    qryStr += ` GROUP BY articles.article_id`;
  
    if (sort_by) {
      if (validSortBy.includes(sort_by)) {
        qryStr += ` ORDER BY ${sort_by}`;
      } else {
        console.error('Invalid sort_by property:', sort_by);
        return Promise.reject({ status: 404, msg: 'property doesnt exist' });
      }
    }
  
    if (!(order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
      console.error('Invalid order:', order);
      return Promise.reject({ status: 400, msg: 'bad request' });
    }
  
    if (order.toLowerCase() === 'desc') {
      qryStr += ` DESC`;
    }
  
    console.log('Executing SQL query:', qryStr, 'with values:', qryValues);
  
    return db.query(qryStr, qryValues).then((results) => {
      if (results.rows.length === 0) {
        console.error('No results found for the query.');
        return Promise.reject({ status: 404, msg: 'property doesnt exist' });
      }
      console.log('Query results:', results.rows);
      return results.rows;
    });
  };

exports.selectArticleCommentsById = (article_id) => {
   return db.query(`SELECT articles.article_id, comments.comment_id, comments.body, comments.votes, comments.created_at, comments.author 
    FROM articles 
    LEFT JOIN comments 
        ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    `, [article_id]).then(results => {
        if(results.rows.length === 0){
                return Promise.reject({status: 404, msg: 'article doesnt exist'})
            }
        if(results.rows[0].comment_id === null) {
            return []
        }
        
        return results.rows.map(({article_id, ...items}) => {
            return items
        })
    })
}

exports.insertComment = (username, body, article_id) => {
    if(username === undefined || body === undefined) {
        return Promise.reject({status: 400, msg: 'missing fields'})
    }

    if(typeof username !== 'string' || typeof body !== 'string') {
        return Promise.reject({status: 400, msg: 'bad request'})
    }
    
    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *', [username, body, article_id]).then(results => {
            return results.rows[0]
        })
    }