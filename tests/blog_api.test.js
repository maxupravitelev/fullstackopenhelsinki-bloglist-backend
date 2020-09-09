const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('testing amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)

})

test('testing amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0]['id']).toBeDefined()

})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
  const titles = blogsAtEnd.map(r => r.title)
  
  expect(titles).toContain(
    'Canonical string reduction'
  )
})

// test('blogs are returned as json', async () => {
//     await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })

afterAll(() => {
  mongoose.connection.close()
})