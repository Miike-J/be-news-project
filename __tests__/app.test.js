const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const topicData = require('../db/data/test-data/index')
const request = require('supertest')
require('jest-sorted')

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

describe('/api/articles', () => {
    test('200: Responds with an articles array of article objects - need a comment_count key - sorted by date in descending order', () =>{
        return request(app).get('/api/articles').expect(200).then(({body}) => {
            expect(body.articles).toBeInstanceOf(Array)
            expect(body.articles).toHaveLength(12)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
            body.articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                }))
            })
        })
    })
    test('200: can sort articles by any valid column', () => {
        return request(app).get('/api/articles?sort_by=author').expect(200).then(({body}) => {
            expect(body.articles).toBeSortedBy('author', {descending: true})
        })
    })
    test('200: order can be set to asc or desc, default desc', () => {
        return request(app).get('/api/articles?order=asc').expect(200).then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at')
        })
    })
    test('200: can be sorted by specific topic', () => {
        return request(app).get('/api/articles?author=butter_bridge').expect(200).then(({body}) => {
            expect(body.articles).toBeInstanceOf(Array)
            expect(body.articles).toHaveLength(3)
            body.articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: 'butter_bridge',
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                }))
            })
        })
    })
    test('404: invalid sort_by column', () => {
        return request(app).get('/api/articles?sort_by=authorsName').expect(404).then(({body}) => {
            expect(body.msg).toBe('property doesnt exist')
        })
    })
    test('400: order isnt asc or desc', () => {
        return request(app).get('/api/articles?order=hightolow').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: topic not in table', () => {
        return request(app).get('/api/articles?pet=true').expect(404).then(({body}) => {
            expect(body.msg).toBe('property doesnt exist')
        })
    })
    test('400: sort_by blank', () => {
        return request(app).get('/api/articles?sort_by=').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: order blank', () => {
        return request(app).get('/api/articles?order=').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: topic blank', () => {
        return request(app).get('/api/articles?author=').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })

})

describe('/api/articles/articles_id', () => {
    test('200: Get responds with an article object', () => {
        return request(app).get('/api/articles/1').expect(200).then(({body}) => {
            expect(body.article).toEqual(expect.objectContaining({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_id: 1
            }))
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

describe('/api/articles/:article_id/comments', () => {
    test('200: Get responds with an array of comment objects for given id', () => {
        return request(app).get('/api/articles/1/comments').expect(200).then(({body}) => {
            expect(body.comments).toBeInstanceOf(Array)
            expect(body.comments).toHaveLength(11)
            body.comments.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                }))
            })
        })
    })
    test('200: article has no comments', () => {
        return request(app).get('/api/articles/12/comments').expect(200).then(({body}) =>{
            expect(body.comments).toEqual([])
        })
    })
    test('400: article_id isnt a number', () => {
        return request(app).get('/api/articles/moose/comments').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: article_id too high', () => {
        return request(app).get('/api/articles/100/comments').expect(404).then(({body}) => {
            expect(body.msg).toBe('article doesnt exist')
        })
    })
    test('201: Post adds obj to comments table and returns posted obj', () => {
        const commentObj = {
               username: "rogersop",
               body: "i dont know whats going on" 
        }
        return request(app).post('/api/articles/1/comments').send(commentObj).expect(201).then(({body}) => {
            expect(body.comment).toEqual(expect.objectContaining({
                article_id: 1,
                comment_id: expect.any(Number),
                body: 'i dont know whats going on',
                author: 'rogersop',
                votes: 0,
                created_at: expect.any(String)
            }))
        })
    })
    test('400: username/body are the wrong type', () => {
        const badObj = {
            username: 2,
            body: 'dkdkdk'
        }
        return request(app).post('/api/articles/1/comments').send(badObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: article_id isnt a number', () => {
        const obj = {
            username: 'rogersop',
            body: 'jojpfoin'
        }
        return request(app).post('/api/articles/bear/comments').expect(400).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: article_id too high', () => {
        const obj = {
            username: 'rogersop',
            body: 'fwifenffefm'
        }
        return request(app).post('/api/articles/140/comments').send(obj).expect(404).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('404: username not registered', () => {
        const badObj = {
            username: 'steph_Curry',
            body: 'wheres the basketball'
        }
        return request(app).post('/api/articles/1/comments').send(badObj).expect(404).then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('400: no username/body fields', () => {
        const badObj = {
            body: 'dadsldfjidfslkm'
        }
        return request(app).post('/api/articles/1/comments').send(badObj).expect(400).then(({body}) => {
            expect(body.msg).toBe('missing fields')
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

describe('/api/articles/articles_id refactor', () => {
    test('200: Refactor Get should also include comment_count key which is the total count of all the comments with this article_id', () => {
        return request(app).get('/api/articles/1').expect(200).then(({body}) => {
            expect(body.article).toEqual(expect.objectContaining({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                comment_count: 11,
                article_id: 1
            }))
        })
    })
})
