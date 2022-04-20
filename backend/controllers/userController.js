const jwt = require("jsonwebtoken") // web token to stay logged in
const bcrypt = require("bcryptjs") // encrypt my passwords
const asyncHandler = require("express-async-handler") // So i can use the Async Handler
const User = require("../models/userModel") // So I can use the models

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  console.log(name)
  console.log(email)
  console.log(password)

  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please add all fields")
  }

  // check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Hash password with bcrypt

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create User

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({
      // 201 something was created
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials")
  }
})

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id)
  res.status(200).json({
    _id: _id,
    name,
    email
  })
})

// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe
}
