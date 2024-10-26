const Router = require("express")
const router = new Router()
const controller = require("../controllers/AuthController")
const {check} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/registration", 
[
  check("username", "Empty username").notEmpty(), 
  check("password", "Short password. Length over 8 characters is recommended").isLength({min:8})
],
controller.registration)
router.post("/login", controller.login)
router.get("/token", controller.token)
router.get("/logout", [
  authMiddleware
], controller.logout)
// router.get("/getUsers", controller.getUsers)

module.exports = router