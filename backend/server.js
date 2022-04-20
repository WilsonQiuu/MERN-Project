const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
// overwrite the error handler
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")

const port = process.env.PORT || 5000

connectDB()

const app = express()

// this is so we can use body data (middleware)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// we could have all our routes here but it's better to put them in a separate file
app.use("/api/goals", require("./routes/goalRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

app.use(errorHandler) // overwrite default express error handler

app.listen(port, () => console.log(`Server started on port ${port}`))
