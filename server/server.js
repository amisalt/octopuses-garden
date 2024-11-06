const express = require("express")
require("dotenv").config()
const imageRouter = require("./routers/imageRouter")
const authRouter = require("./routers/authRouter")
const gameInfoRouter = require("./routers/gameInfoRouter")
const gamePlayedRouter = require("./routers/gamePlayedRouter")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const PORT = process.env.STATUS === 'production' ? process.env.PORT_PROD : process.env.PORT_DEV
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.static("static"))
app.use("/image", express.static("static"))
app.use("/auth", authRouter)
app.use("/gameInfo", gameInfoRouter)
app.use("/game", gamePlayedRouter)

const onlineGamePlayers = []

const start = async ()=>{
    try{
        await mongoose.connect(process.env.URI, clientOptions)
        server.listen(PORT, ()=>{
            console.log(`server (${PORT}) started ><`);
        })
        app.get('/backend', (req, res) => {
            res.send({ express: 'backend is connected ><' })
        });
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("database is connected ><");
        io.on('connection', (socket) => {
            console.log(`user connected ${socket.id}`);
            socket.emit("yourID", socket.id)
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }catch(e){
        console.error(e);
        await mongoose.disconnect();
    }
}
start()