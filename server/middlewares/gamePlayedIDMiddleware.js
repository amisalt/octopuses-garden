module.exports = function(req, res, next){
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const {gameToken} = req.cookies
    if(!gameToken){
      return res.status(403).json({"message":"Game session hasn't take place"})
    }
    const decodedData = jwt.verify(gameToken, process.env.SECRET_KEY)
    req.gamePlayed = decodedData
    next()
  }catch(e){
    console.log(e);
    return res.status(400).json({"message":"Unhandled error", e})
  }
}