const express = require('express')
const {getTopics} = require('./Controller/app-controller')

const app = express()

app.get('/api/topics', getTopics)

app.use('/*', (req, res, next) => {
    res.status(404).send({msg: 'Not found'})
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Sever Error'})
})

module.exports = app