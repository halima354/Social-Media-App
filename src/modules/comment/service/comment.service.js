import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as DBService from '../../../DB/DBservice.js'
import postModel from "../../../DB/model/Post.model.js";
import commentModel from "../../../DB/model/Comment.model.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import { roleTypes } from "../../../DB/model/User.model.js";

export const createComment = asyncHandler(
    async(req, res, next) =>{
        const { postId} = req.params
        const post= await DBService.findOne({
            model : postModel,
            filet:{
                _id:postId,
                isDeleted: {$exists: false}
            }
        })
        if (!post) {
            
            return next(new Error("invalid post", {cause: 404}))
        }

           // const {content} = req.body
        if(req.files?.length){
            const attachments =[]
            for (const file of req.files) {
                const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: `socialApp/${post.userId}/post/comments`})
                attachments.push({secure_url, public_id})
            }
            req.body.attachments= attachments
        }
        
            const comment = await DBService.create({
                model : commentModel,
                data:{
                ...req.body,
                    postId,
                    userId: req.user._id
                
                }
            })
        
        return successResponse({res, data:{comment} })
})

export const updateComment = asyncHandler(
    async(req, res, next) =>{
        const {postId, commentId}=  req.params
        const comment = await DBService.findOne({
            model: commentModel,
            filter: {
                _id :commentId,
                postId,
                userId: req.user._id,
                isDeleted:{$exists:false}
            },
            populate:[{

                path: "postId"
            }]
        })
        if (!comment || comment.postId.isDeleted) {
            return next (new Error("invalid comment",{cause:404}))
        }
        if(req.files?.length){
            const attachments= []
            for (const file of req.files) {
                const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "socialApp/post"})
                attachments.push({secure_url, public_id})
            }
            req.body.attachments= attachments
            }
            const savedComment = await DBService.findOneAndUpdate({
                model :commentModel,
                filter:{
                    _id :commentId,
                    postId,
                    userId: req.user.id,
                    isDeleted:{ $exists: false},
                },
                data: {
                    ...req.body
                },
                option:{
                    new: true
                }
            })
            return successResponse({res, data:{comment : savedComment} })
})

export const freezeComment = asyncHandler(
    async(req, res, next) =>{
        const {postId, commentId}=req.params
        const comment = await DBService.findOne({
            model: commentModel,
            filter: {
                _id :commentId,
                postId,
                isDeleted:{$exists:false}
            },
            populate:[{

                path:"postId"
            }]
        })
        if (
        !comment ||
        ( req.user.role != roleTypes.admin
            &&
            req.user.id.toString() != commentId
            &&
            req.user.id.toString() != comment.postId.userId.toString()
        )
        ) {
            return next (new Error("invalid comment",{cause:404}))
        }
        const savedComment=await DBService.findOneAndUpdate({
            model : commentModel,
            filter:{
            _id : commentId,
            postId,
            isDeleted:{$exists : false}
        },
        data:{
            isDeleted: Date.now(),
            deletedBy: req.user._id
        },
        options:{new :true}
        })
            return successResponse({res, data:{comment : savedComment} })
})

export const unfreezeComment = asyncHandler(
    async(req, res, next) =>{
        const {postId, commentId}=req.params
        const savedComment=await DBService.findOneAndUpdate({
            model : commentModel,
            filter:{
            _id : commentId,
            postId,
            isDeleted:{$exists : true},
            deletedBy: req.user._id
        },
        data:{
            $unset:{
            isDeleted: 0,
            deletedBy: 0},
            updatedBy: req.user._id
        },
        options:{new :true}
        })
            return successResponse({res, data:{comment : savedComment} })
})


