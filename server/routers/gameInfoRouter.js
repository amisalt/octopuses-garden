const Router = require("express")
const router = new Router()
const controller = require("../controllers/GameInfoController")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")
const gamePlayedIDMiddleware = require("../middlewares/gamePlayedIDMiddleware")

router.get("/createGame", [
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"])
], controller.create)
// ? getting stats object
router.get("/stats", [
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.stats)
// TODO Tranfer this into end function of gamePlayedController
router.get("/gainXP", [
  authMiddleware,
  gamePlayedIDMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.gainXP)
router.get("/gainMoney", [
  authMiddleware,
  gamePlayedIDMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.gainMoney)
// TODO END
// *Upgrade id in params
router.get("/buyUpgrade/:id", [
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.buyUpgrade)
// ? getting available upgrades list of objects
router.get("/availableUpgrades", [
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.availableUpgrades)
// ? getting object 
// ? {
// ?   availableLevels:[{object type level}],
// ?   unavailableLevels:[{object type level}]
// ? }
router.get("/availableLevels", [
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.availableLevels)


module.exports = router