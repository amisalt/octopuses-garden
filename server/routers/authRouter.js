const Router = require("express")
const router = new Router()
const controller = require("../controllers/AuthController")
const {body, cookie} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

// * body: username, password
router.post("/registration", 
[
  body("username", "Empty username").notEmpty(), 
  body("password", "Short password. Length over 8 characters is recommended").isString().isLength({min:8})
],
controller.registration)
// ? getting tokens in cookies
// ? getting user object
// * body: username, password
router.post("/login", [
  body("username", "Empty username").notEmpty(),
  body("password", "Short password").notEmpty().isLength({min:8}),
], controller.login)
// ? getting tokens in cookies
// ? getting user object
// * refreshToken in cookies
router.get("/token", [
  cookie("refreshToken", "Empty refresh token").notEmpty()
], controller.token)
// ! removing tokens in cookies
router.get("/logout", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"]),
], controller.logout)
// * body : username(target user)
router.post("/makeAdmin", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("username", "Empty username").notEmpty(),
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
], controller.makeAdmin)
// * body : username(target user)
router.post("/removeAdmin", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("username", "Empty username").notEmpty(),
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
], controller.removeAdmin)
// * body : username(target user)
router.post("/ban", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("username", "Empty username").notEmpty(),
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
], controller.ban)
// * body: value (role name)
router.post("/createRole", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("value", "Empty role value").notEmpty(),
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
], controller.createRole);
// * body: value (role name)
router.post("/deleteRole", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("value", "Empty role value").notEmpty(),
  authMiddleware,
  rolesMiddleware(["ADMIN"]),
], controller.deleteRole);

router.get("/placeholder",  controller.placeholder)

module.exports = router