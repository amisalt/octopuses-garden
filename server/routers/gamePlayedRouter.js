const Router = require("express")
const router = new Router()
const controller = require("../controllers/GamePlayedController")
const {param, cookie, header, body} = require("express-validator")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")
const gamePlayedIDMiddleware = require("../middlewares/gamePlayedIDMiddleware")

// ? getting game token in response datas
router.get("/start/:levelId/:mode", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  param("levelId", "Not a mongo level Id").isMongoId(),
  param("mode", "Not uppercase mode param filed").isUppercase(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.start)
router.get("/connect", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  header("authgame", "Empty game token or is not JWT").isJWT(),
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"]),
  gamePlayedIDMiddleware
], controller.connect)
// * body : overallTime(required only for the game host, default: 0), xp, money, xpOverall(required only for the host, default: 0), moneyOverall(required only for the host, default:0)
router.post("/end", [
  cookie("token", "Empty token or is not JWT").isJWT(),
  header("authgame", "Empty game token or is not JWT").isJWT(),
  body("xp", "xp is not int or is negative").isInt({min:0}),
  body("money", "money is not int or is negative"),
  body("overallTime", "Time is not int or is negative").isInt({min:0}),
  body("xpOverall", "xpOverall is not int or is  negative").isInt({min:0}),
  body("moneyOverall", "moneyOverall is not int or  is negative").isInt({min:0}),
  authMiddleware,
  gamePlayedIDMiddleware,
  rolesMiddleware(["ADMIN","USER"]),
], controller.end)
// ? getting [object type game played]
router.get("/leaderboard/:levelId/:mode",[
  cookie("token", "Empty token or is not JWT").isJWT(),
  param("levelId", "Not a mongo level Id").isMongoId(),
  param("mode", "Not uppercase mode param filed").isUppercase(),
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.leaderboardByLevel)

module.exports = router