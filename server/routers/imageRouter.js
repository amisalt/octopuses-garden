const Router = require("express")
const router = new Router()
const path = require("path")

function getLevelLayer(params, res){
  const {level, layer} = params
  const link = `../static/levels/${level}/${layer}.png`
  // res.sendFile(`../static${link}`)
  
  res.status(200).json({link})
}
router.get("/levels/:level/:layer", (req, res)=>getLevelLayer(req.params, res))

function getCustomer(params, res){
  const {type, id} = params
  const link = `../static/customers/${type}/${id}.png`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/customers/:type/:id", (req, res)=>getCustomer(req.params, res))

function getFood(params, res){
  const {level, type} = params
  const link = `../static/food/${level}/${type}.png`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/food/:level/:type", (req, res)=>getFood(req.params, res))

function getIcons(params, res){
  const {page} = params
  const link = `../static/icons/${page}.png`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/icon/:page", (req, res)=>getIcons(req.params, res))

function getSprites(params, res){
  const {part, color} = params
  path.resolve()
  const link = `${path.resolve()}\\static\\sprites\\${part}\\${color}.png`
  res.sendFile(link)
  res.status(200).json({link, a:path.resolve()})
}
router.get("/sprite/:part/:color", (req, res)=>getSprites(req.params, res))

module.exports = router