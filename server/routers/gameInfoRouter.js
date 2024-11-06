const Router = require("express")
const router = new Router()
const controller = require("../controllers/GameInfoController")
const {param, cookie, body} = require("express-validator")
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
// * body: name, description, priceBonus, xpBonus, xpRequired
router.post("/createLevel", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("name").notEmpty().isLength({min:1,max:25}),
  body("description").notEmpty().isLength({min:1,max:100}),
  body("priceBonus").isInt({min:1}),
  body("xpBonus").isInt({min:1}),
  body("xpRequired").isInt({min:0}),
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.createLevel)
//*body: levelId
router.post("/deleteLevel", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("levelId").isMongoId(),
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.deleteLevel)
//*body: name, description, cost, upgrade, quality, device, class, classLevel
router.post("/createUpgrade", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("name").notEmpty().isLength({min:1,max:25}),
  body("description").notEmpty().isLength({min:1,max:100}),
  body("cost").isInt({min:1}),
  body("upgrade").isFloat({min:1}),
  body("quality").notEmpty(),
  body("device").notEmpty(),
  body("class").notEmpty(),
  body("classLevel").isInt({min:0}),
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.createUpgrade)
// *body: upgradeId
router.post("/deleteUpgrade", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  body("upgradeId").isMongoId(),
  authMiddleware,
  rolesMiddleware(["ADMIN"])
], controller.deleteUpgrade)



module.exports = router