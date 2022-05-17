const express = require('express')
const {getTopics} = require('./Controller/topics.controller')
const {getArticleById, patchArticleById} = require('./Controller/articles.contoller')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)

app.use('/*', (req, res, next) => {
    res.status(404).send({msg: 'Not found'})
})

app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg: 'bad request'})
    } else if (err.status === 400 && err.msg === 'bad request'){
        res.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.status === 404 && err.msg === 'article doesnt exist') {
        res.status(404).send({msg: 'article doesnt exist'})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Sever Error'})
})

module.exports = app