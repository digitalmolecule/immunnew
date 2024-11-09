import express from 'express'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import {createServer} from 'http'
import cors from 'cors'
import path from 'path'


const __dirname = path.resolve()


const app = express()
 const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST"],
        credentials:true
    }
})

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST"],
    credentials:true
}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './src/routes/user.route.js'
import messageRouter from './src/routes/message.route.js'
import allRouter from './src/routes/alluser.route.js'
app.use("/api/v1/users",userRouter)
app.use("/api/v1/messages",messageRouter)
app.use("/api/v1/alluser",allRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

app.get("/",(req,res)=>{
    res.send("Heloo")
    console.log("HELO WORLD")
})


const getRecieverSockedId = (recieverid)=>{
    return userSocketMap[recieverid]
}
const userSocketMap = {}

// just for commnet
io.on("connection",(socket)=>{
  console.log("user connected",socket.id);

  socket.emit("Welcome",`welcome user, ${socket.id}`)

  const userid = socket.handshake.query.userid
  if(userid != undefined) userSocketMap[userid] = socket.id
  
  io.emit("getOnlineUsers",Object.keys(userSocketMap))
  socket.on("disconnect",()=>{
    console.log("user disconnected",socket.id)
    delete userSocketMap[userid]
  io.emit("getOnlineUsers",Object.keys(userSocketMap))

})
})

export {app,io,server,getRecieverSockedId} 