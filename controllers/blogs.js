const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

// get all blogposts by user
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// create new blogpost
blogRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  // console.log(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
    comments: [],
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

// remove blogpost by id
blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === request.body.userId.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response
      .status(403)
      .json({ error: 'user is not permitted to delete blog' })
  }
})

// update likes
blogRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  const updatedLikes = {
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedLikes,
    { new: true }
  )
  response.json(updatedBlog)
})

// add comments
blogRouter.put('/:id/comments', async (request, response) => {
  const blogId = request.params.id

  const body = request.body

  const newComment = body.newComment

  const oldBlog = await Blog.findById(blogId)

  const oldComments = oldBlog.comments

  const updatedComments = {
    comments: [...oldComments, newComment],
  }


  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedComments,
    { new: true }
  )
  response.json(updatedBlog)
})

module.exports = blogRouter
