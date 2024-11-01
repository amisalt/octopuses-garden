const Router = require("express")
const router = new Router()
const controller = require("../controllers/GameInfoController")
const {param, cookie} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/createGame", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"])
], controller.create)
// ? getting stats object
router.get("/stats", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.stats)
// *Upgrade id in params
router.get("/buyUpgrade/:id", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  param("id", "Empty upgrade id or is not mongo ID").isMongoId(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.buyUpgrade)
// ? getting available upgrades list of objects
router.get("/availableUpgrades", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.availableUpgrades)
// ? getting object 
// ? {
// ?   availableLevels:[{object type level}],
// ?   unavailableLevels:[{object type level}]
// ? }
router.get("/availableLevels", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.availableLevels)


module.exports = router