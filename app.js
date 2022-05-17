const express = require('express')
const {getTopics} = require('./Controller/topics.controller')
const {getArticleById, patchArticleById} = require('./Controller/articles.contoller')
const {handlePSQLErrors, handleCustomErrors, handleServerErrors} = require('./Controller/error.controller')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)

app.use('/*', (req, res, next) => {
    res.status(404).send({msg: 'Not found'})
})

app.use(handleCustomErrors)
app.use(handlePSQLErrors) 
app.use(handleServerErrors)

module.exports = app