const Router = require("express")
const router = new Router()
const controller = require("../controllers/GamePlayedController")
const rolesMiddleware = require("../middlewares/rolesMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")
const gamePlayedIDMiddleware = require("../middlewares/gamePlayedIDMiddleware")

// ? getting game token in response datas
router.get("/start/:levelId/:mode", [
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.start)
router.get("/connect", [
  authMiddleware,
  rolesMiddleware(["ADMIN", "USER"]),
  gamePlayedIDMiddleware
], controller.connect)
// * body : overallTime(required only for the game host), xp, money, xpOverall(required only for the host), moneyOverall(required only for the host)
router.post("/end", [
  authMiddleware,
  gamePlayedIDMiddleware,
  rolesMiddleware(["ADMIN","USER"]),
], controller.end)
// ? getting [object type game played]
router.get("/leaderboard/:levelId/:mode",[
  authMiddleware,
  rolesMiddleware(["ADMIN","USER"])
], controller.leaderboardByLevel)

module.exports = router