const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

let global_token = ''

// reset before each rest
beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .then((response) => (global_token = response.body.token))

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    _id: '5f5b5e603dcf8d4dccd86e12',
    username: 'root',
    passwordHash,
  })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'gsdfg',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map((u) => u.username)
  expect(usernames).toContain(newUser.username)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` to be unique')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('user creation fails if password or username are not valid', async () => {
  const newUser = {
    username: 'ml',
    name: 'Matti',
    password: 'b',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('delete blog while user is logged in', async () => {

  let blogId = '5a422a851b54a676234d17f7'

  let userId = '5f5b5e603dcf8d4dccd86e12'

  await api
    .delete('/api/blogs/' + blogId)
    .send({ userId })
    .set('Authorization', `Bearer ${global_token}`)
    .expect(204)
})
