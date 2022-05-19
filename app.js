const express = require('express')
const {getTopics} = require('./Controller/topics.controller')
const {getArticleById, patchArticleById, getArticles, getArticleCommentsById, postArticleComment} = require('./Controller/articles.contoller')
const {handlePSQLErrors, handleCustomErrors, handleServerErrors} = require('./Controller/error.controller')
const {getUsers} = require('./Controller/users.controller')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
app.post('/api/articles/:article_id/comments', postArticleComment)

app.get('/api/users', getUsers)

app.use('/*', (req, res, next) => {
    res.status(404).send({msg: 'Not found'})
})

app.use(handleCustomErrors)
app.use(handlePSQLErrors) 
app.use(handleServerErrors)

module.exports = app