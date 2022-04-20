const express = require("express")
const router = express.Router()

// met functions in the separate file
const {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal
} = require("../controllers/goalController")
// my routes
// Shortening when they have the same route
router.route("/").get(getGoals).post(setGoal)

router.route("/:id").delete(deleteGoal).put(updateGoal)
/**
 * router.get("/", getGoals)
 * router.post("/", setGoal)
 * router.put("/:id", updateGoal)
 * router.delete("/:id", deleteGoal)
 */

module.exports = router