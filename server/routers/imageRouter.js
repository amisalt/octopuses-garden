const Router = require("express")
const router = new Router()

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
  const link = `../static/customers/${level}/${type}.png`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/food/:level/:type", (req, res)=>getFood(req.params, res))

module.exports = router