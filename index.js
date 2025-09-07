import path from 'node:path'
import * as dotenv from 'dotenv'
dotenv.config({path:path.resolve("./src/config/.env.dev")})
import  bootstrap  from './src/app.controller.js'
import  express  from 'express'
import {Server} from 'socket.io'
import {sendMessage} from './src/modules/socket/service/message.service.js'
import { authenticationSocket } from './src/middelware/socket/auth.socket.meddleware.js'

const app = express()
const port = process.env.PORT ||5000
const socketConnection =  new  Map()
bootstrap(app , express)

const httpServer= app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = new Server(httpServer, {cors: "*"})

const register = async(socket) =>{
    const {data, valid}= await authenticationSocket({socket})
    console.log({data, valid});
    if (!valid) {
        socket.emit("socket_Error", data)
    }
    socketConnection.set(data?.user._id.toString(), socket.id)
    return "done"
}

const logoutSocket = async( socket)=>{

    return  socket.on("disconnect", async()=>{
        const {data,valid} = await authenticationSocket({socket})
        if (!valid) {
            return  socket.emit("socketError", data)
        }
        socketConnection.delete(data.user._id.toString(), socket.id)
        console.log(socketConnection);
        return "done"
    })

}

io.on("connection", async(socket)=>{
    console.log(socket.id);
    console.log(socket.handshake.auth.authorization);
    await register(socket)
    await logoutSocket(socket)
    await sendMessage(socket)
    
})
