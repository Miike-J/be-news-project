const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const topicData = require('../db/data/test-data/index')
const request = require('supertest')

beforeEach(() => seed(topicData))

afterAll(() => db.end)

describe('/api/topics', () => {
    test('200: Responds with array of topic objects each with slug and description', () => {
        return request(app).get('/api/topics').expect(200).then((results) => {
            const {topics} = results.body
            expect(topics).toBeInstanceOf(Array)
            expect(topics).toHaveLength(3)
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe('Incorrect file path', () => {
    test('404: not found', () => {
        return request(app).get('/sendtopics').expect(404).then((results) => {
            expect(results.body.msg).toBe('Not found')
        })
    })
})

describe('/api/articles/articles_id', () => {
    test('200: Get responds with an article object', () => {
        return request(app).get('/api/articles/1').expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
            })
        })
    })
    test('400: parametric endpoint isnt a number', () => {
        return request(app).get('/api/articles/first').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: parametic endpoint goes too high', () => {
        return request(app).get('/api/articles/15').expect(404).then(({body}) => {
            expect(body.msg).toBe('article doesnt exist')
        })
    })
    test('200: Patch accepts obj and updates votes property on article from given id', () => {
        const updateObj = {inc_votes: 10}
        return request(app).patch('/api/articles/1').send(updateObj).expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 110,
            })
        })
    })
    test('200: Check patch works with negatives', () => {
        const updateObj = {inc_votes: -99}
        return request(app).patch('/api/articles/1').send(updateObj).expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 1,
            })
        })
    })
    test('400: parametric endpoint isnt a number', () => {
        const updateObj = {inc_votes: 11111}
        return request(app).patch('/api/articles/beans').send(updateObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: parametric endpoint is too high', () => {
        const updateObj = {inc_votes: 11111}
        return request(app).patch('/api/articles/20').send(updateObj).expect(404).then(({body}) => {
            expect(body.msg).toBe('article doesnt exist')
        })
    })
    test('400: obj value is wrong type', () => {
        const updateObj = {inc_votes: 'cheese'}
        return request(app).patch('/api/articles/1').send(updateObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: obj value is trying to remove more votes than current votes value (stop having negative number of votes)', () => {
        updateObj = {inc_votes: -101}
        return request(app).patch('/api/articles/1').send(updateObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: obj key is wrong', () => {
        const updateObj = {change_votes: 10}
        return request(app).patch('/api/articles/1').send(updateObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})

describe('/api/users', () => {
    test('200: Get responds with an array of objects with the username property', () => {
        return request(app).get('/api/users').expect(200).then(({body}) => {
            const {users} = body 
            expect(users).toBeInstanceOf(Array)
            expect(users).toHaveLength(4)
            users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String)
                })
            })
        })
    })
})