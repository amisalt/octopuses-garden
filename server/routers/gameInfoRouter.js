const Router = require("express")
const router = new Router()
const controller = require("../controllers/GameInfoController")
const {check} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/createGame", [
  authMiddleware
], controller.create)

module.exports = router