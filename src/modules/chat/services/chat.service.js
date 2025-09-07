import { asyncHandler } from "../../../utils/response/error.response.js";
import * as DBService from '../../../DB/DBservice.js'
import chatModel from "../../../DB/model/Chat.model.js";
import { successResponse } from "../../../utils/response/success.response.js";
export const getChat = asyncHandler(async(req, res, next) => {
    const {friendId } =req.params
    const chat = await DBService.findOne({
        model: chatModel,
        filter:{
            $or:[
                {
                mainUser: req.user._id,
                supParticipant: friendId

                },
                {
                    mainUser: friendId,
                    supParticipant: req.user._id
                    
                    },
            ]
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
    return successResponse({res, data:{chat}})
})