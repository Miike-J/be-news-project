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
            const topics = results.body
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