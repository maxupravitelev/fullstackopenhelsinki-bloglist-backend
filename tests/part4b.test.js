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

// check test naming
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
    userId: '5f5b5e603dcf8d4dccd86e12'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContain('Canonical string reduction')
})

test('insert default value of 0 if likes-property is missing ', async () => {
  const newBlog = {
    title: 'Testing without likes',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    userId: '5f5b5e603dcf8d4dccd86e12'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blog = await Blog.find({title: 'Testing without likes'})

  expect(blog[0]["likes"]).toEqual(0)

})

test('missing title & url', async () => {

  const newBlog = {
    author: 'Edsger W. Dijkstra',
    userId: '5f5b5e603dcf8d4dccd86e12'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})


test('delete blog', async () => {
  
  const id = '5a422a851b54a676234d17f7'

  await api
    .delete('/api/blogs/' + id)
    .expect(204)

})

test('update likes', async () => {
  
  const id = '5a422a851b54a676234d17f7'

  let likes = {likes: 20}

  await api
    .put('/api/blogs/' + id)
    .send(likes)
    .expect(likes)
})


afterAll(() => {
  mongoose.connection.close()
})