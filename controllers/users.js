const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// create new user
usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3 || body.password.username < 3) {
    return response
      .status(400)
      .json({ error: 'username and password must be at least 3 chars long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

// get user data
usersRouter.get('/', async (request, response) => {
  const user = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.json(user)
})


// get user data by user id
usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.json(user)
})

module.exports = usersRouter
