const express = require("express")
require("dotenv").config()
const imageRouter = require("./routers/imageRouter")
const authRouter = require("./routers/authRouter")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const PORT = process.env.STATUS === 'production' ? process.env.PORT_PROD : process.env.PORT_DEV
const app = express()
const http = require("http")
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use("/image", imageRouter)
app.use("/auth", authRouter)

const start = async ()=>{
    try{
        await mongoose.connect(process.env.URI, clientOptions)
        server.listen(PORT, ()=>{
            console.log(`server (${PORT}) started ><`);
        })
        app.get('/backend', (req, res) => {
            res.send({ express: 'backend is connected ><' });
        });
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("database is connected ><");
        
    }catch(e){
        console.error(e);
        await mongoose.disconnect();
    }
}
start()