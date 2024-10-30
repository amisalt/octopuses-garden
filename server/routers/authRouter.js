const Router = require("express")
const router = new Router()
const controller = require("../controllers/AuthController")
const {check, cookie} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

// * body: username, password
router.post("/registration", 
[
  check("username", "Empty username").isString().notEmpty(), 
  check("password", "Short password. Length over 8 characters is recommended").isString().isLength({min:8})
],
controller.registration)
// ? getting tokens in cookies
// * body: username, password
router.post("/login", [
  check("username", "Empty username").isString().notEmpty(),
  check("password", "Short password").isString().isLength({min:8}),
], controller.login)
// ? getting tokens in cookies
// * refreshToken in cookies
router.get("/token", [
  // cookie("refreshToken", "Invalid refresh token").isString()
], controller.token)
// ! removing tokens in cookies
router.get("/logout", [
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"])
], controller.logout)
// * body : username(target user)
router.post("/makeAdmin", [
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.makeAdmin)
// * body : username(target user)
router.post("/removeAdmin", [
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.removeAdmin)
// * body : username(target user)
router.post("/ban", [
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.ban)

router.get("/placeholder/:id/:lol/:emae",  controller.placeholder)

module.exports = router