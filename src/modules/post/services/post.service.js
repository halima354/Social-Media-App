import { asyncHandler } from "../../../utils/response/error.response.js";
import postModel from "../../../DB/model/Post.model.js";
import * as DBService from '../../../DB/DBservice.js'
import { successResponse } from "../../../utils/response/success.response.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import userModel, { roleTypes } from "../../../DB/model/User.model.js";
import commentModel from "../../../DB/model/Comment.model.js";
import { pagination } from "../../../utils/pagination/pagination.js";

export const createPost = asyncHandler(
    async(req, res,next ) => {
    const {content} = req.body
    const attachments =[]
    for (const file of req.files) {
        const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "socialApp/post"})
        attachments.push({secure_url, public_id})
    }

    const post = await DBService.create({
        model :postModel,
        data:{
            content,
            attachments,
            userId: req.user._id
        
        }
    })
                return successResponse({ res, data: {post} })
})

export const updatePost =asyncHandler(

    async(req, res, next) =>{

        if(req.files?.length){
            const attachments= []
            for (const file of req.files) {
                const {secure_url, public_id}= await cloud.uploader.upload(file.path,{folder: "socialApp/post"})
                attachments.push({secure_url, public_id})
            }
            req.body.attachments= attachments
            }
            const post = await DBService.findOneAndUpdate({
                model :postModel,
                filter:{
                    
                    _id :req.params.postId,
                    isDeleted:{ $exists: false},
                    userId: req.user._id
                },
                data:{
                    ...req.body,
                },
                option:{
                    new: true
                }
            })
        return post? successResponse({ res, data: {post} }) : next (new Error(" invalid post id", {cause: 404}))
})

export const freezePost =asyncHandler(

    async(req, res, next) =>{

    const owner= req.user.role === roleTypes.admin? {}: {userId: req.user._id}
    const post = await DBService.findOneAndUpdate({
        model :postModel,
        filter:{
        _id :req.params.postId,
        isDeleted:{ $exists: false},
        ...owner
                },
        data:{
            isDeleted: Date.now(),
            deletedBy:  req.user._id
            },
        option:{
            new: true
            }
                })
            return post? successResponse({ res, data: {post} }) : next (new Error(" invalid post id", {cause: 404}))
})

export const restorePost =asyncHandler(

    async(req, res, next) =>{

    const post = await DBService.findOneAndUpdate({
        model :postModel,
        filter:{
        _id :req.params.postId,
        isDeleted:{ $exists: true},
        deletedBy:  req.user._id
                },
        data:{
            $unset:{
                isDeleted: 0,
                deletedBy:  0
            }
            },
        option:{
            new: true
            }
                })
            return post? successResponse({ res, data: {post} }) : next (new Error(" invalid post id", {cause: 404}))
})

export const likePost =asyncHandler(

    async(req, res, next) =>{

    const post = await DBService.findOneAndUpdate({
        model :postModel,
        filter:{
        _id :req.params.postId,
        isDeleted:{ $exists: false},

                },
        data:{
            $addToSet:{likes: req.user._id}
            
            },
        option:{
            new: true
            }
                })
            return post? successResponse({ res, data: {post} }) : next (new Error(" invalid post id", {cause: 404}))
})

export const unlikePost =asyncHandler(

    async(req, res, next) =>{

    const post = await DBService.findOneAndUpdate({
        model :postModel,
        filter:{
        _id :req.params.postId,
        isDeleted:{ $exists: false},

                },
        data:{
            $pull:{likes: req.user._id}
            
            },
        option:{
            new: true
            }
                })
            return post? successResponse({ res, data: {post} }) : next (new Error(" invalid post id", {cause: 404}))
})

//pagination
// const populateList=[
//     {path: 'userId', select:"username image"},
//     {path: 'tags', select:"username image"},
//     {path: 'likes', select:"username image"}
//     ]
// export const getPosts = asyncHandler(
//     async(req, res,next ) => {
        
//         const {page, size} =req.query
//     const data = pagination({
//         model :postModel,
//         filter:{
//         isDeleted: {$exists: false},
//         },
//         page,
//         size,
//         populate: populateList
//     })
//         return successResponse({ res, data: {data} })
// })


export const getPosts =asyncHandler(
    async (req, res, next)=>{
        const results =[]

    const cursor = postModel.find({ }).cursor();

    for (let post = await cursor.next(); post != null; post = await cursor.next()) {
        const comment = await DBService.findOne({
            model: commentModel,
            filter:{
                postId: post._id,
                isDeleted: {$exists: false}
            }
        })
    results.push({post , comment})
    }
    return successResponse({res ,data:{results}})
})

export const undoPost =asyncHandler(async(req, res, next) =>{
    const {postId} =req.params
    const post = await DBService.findOne( {
        model: postModel,
        filter:{_id: postId}
    })
    if (!post) {
        return next (new Error("not found this post", {cause:404}))
    }
    if (req.user._id.toString() != post.userId.toString()) {
        return next (new Error("You cannot undo this post after 2 minutes", {cause:404}))
    }
    if (Date.now() - post.isDeleted.getTime()> 2*60*1000) {
        return next(new Error("you can not undoPost"))
    }
    const undoPost= await DBService.findOneAndUpdate({
        model :postModel,
        filter:{
            _id: postId,
        },
        data:{
            $unset:{
                deletedBy: "",
                isDeleted: ''
            }
        }
    })
    
    return successResponse({res, data:{undoPost}})
})

export const retrieveFriendPost= asyncHandler(async(req, res, next) =>{
    const user = await DBService.findOne({
        model:userModel,
        _id: req.user._id,
        populate:[{path:"friends"}]
    })
    if (!user) {
        return next(new Error("not found",{cause:404}))
    }
    const friendLs= user.friends.map(friend => user.friends)
        const retrieveFriendPost= await DBService.findOne({
            model:postModel,
            filter:{
                userId: { $in: friendLs },
                isDeleted:{$exists: false},
                isPublic:true,
            }
        })
        return successResponse({res, data:{retrieveFriendPost}})
})

export const archivePost= asyncHandler(async(req, res, next) =>{
    const {postId}= req.params
    const post = await DBService.findOne({
        model :postModel,
        filter:{
        _id:postId,
        userId:req.user._id
                }
    })
    if (!post) {
        return next(new Error("not found",{cause:404}))
    }
    
    if (Date.now()- post.createdAt.getTime() > 24*60*60*1000) {
        return next(new Error("You cannot archive this post after 24 hours", {cause:400}))
    }

    const archivePost =await DBService.findOneAndUpdate({
        model:postModel,
        filter:{
            _id:postId,
           // isDeleted:{$exists:true}
        },
        data:{
            $addToSet:{archiveList: req.user._id}
        },
        options:{new: true}
    })
    
    console.log('archivePost after update:', archivePost)
    return successResponse({res, data:{archivePost}})
})

