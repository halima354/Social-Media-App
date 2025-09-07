import * as DBService from '../../../DB/DBservice.js'
import chatModel from '../../../DB/model/Chat.model.js'
export const sendMessage=  (socket) =>{
    return socket.on("sendMessage", async(messageData) =>{
        const {data,valid} = await authenticationSocket({socket})
    if (!valid) {
        return  socket.emit("socketError", data)
    }
    const userId= data.user._id
    const {message, destId} =messageData
    console.log({message, destId, userId});

    let chat = await DBService.findOneAndUpdate({
        model: chatModel,
        filter:{
            $or:[
                {
                mainUser: userId,
                supParticipant: destId

                },
                {
                    mainUser: destId,
                    supParticipant: userId
                    
                    },
            ]
        },
        data:{
            $push:{messages: { message, senderId: userId}}
        },
        populate:[
            {
                path: "mainUser",
                select: "username image "
            },
            {
                path: "supParticipant",
                select: "username image "
            }, {
                path: "messages.senderId",
                select: "username image "
            },
        ]
    })
    if (!chat) {
        chat = await DBService.create({
        model: chatModel,
        data:{
            mainUser: userId,
            supParticipant: destId,
            messages: { message, senderId: userId}
        }})
    }
    socket.emit("successMessage", {chat, message})
    socket.to(socketConnection.get(destId)).emit("receiveMessage", {chat, message})
    return "done"
    })
}