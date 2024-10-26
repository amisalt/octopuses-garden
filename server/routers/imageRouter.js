const Router = require("express")
const router = new Router()

function getLevelLayer(params, res){
  const {level, layer} = params
  const link = `../static/levels/${level}/${layer}`
  // res.sendFile(`../static${link}`)
  
  res.status(200).json({link})
}
router.get("/levels/:level/:layer", (req, res)=>getLevelLayer(req.params, res))

function getCustomer(params, res){
  const {type, id} = params
  const link = `../static/customers/${type}/${id}`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/customers/:type/:id", (req, res)=>getCustomer(req.params, res))

function getFood(params, res){
  const {level, type} = params
  const link = `../static/customers/${level}/${type}`
  // res.sendFile(link)
  res.status(200).json({link})
}
router.get("/food/:level/:type", (req, res)=>getFood(req.params, res))

router.get("/", (req,res)=>{
  // TODO: make documentation for this all above here
  res.send({a:"aksdlakdlaskld"})
})

module.exports = router