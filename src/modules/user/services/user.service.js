import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import{compareHash, generateHash} from '../../../utils/security/hash.security.js'
import userModel, { roleTypes } from "../../../DB/model/User.model.js";
import *as DBService from '../../../DB/DBservice.js'
import { emailEvent } from "../../../utils/events/email.event.js";
import { cloud } from "../../../utils/multer/cloudinary.js";
import postModel from "../../../DB/model/Post.model.js";
import { notification } from "../../../utils/events/notification.event.js";
import friendRequestModel from '../../../DB/model/FriendRequest.js'

export const getProfile = asyncHandler(
    async(req , res , next ) => {
        const user = await DBService.findOne({
            model: userModel,
            filter:{ _id: req.user._id ,isDeleted: false},
            populate:[{path: "viewer", select : "username email image"}]
        })
        return successResponse({res , data: {user}})
    }
)

export const shareProfile =asyncHandler( async(req, res, next) =>{
    const {profileId} = req.params
    const user = await DBService.findOne({
        model:userModel,
        filter:{_id: profileId, isDeleted: false},
        select: "username image email phone"
    })
    if(!user){
        return next (new Error(" invalid account id", {cause:404}))
    }
    if (profileId != req.user._id.toString()){
    await DBService.updateOne({
        model:userModel,
        filter:{_id: profileId},
        data:{
            $push: {viewer: {userId: req.user._id , time : Date.now()}}
        }
    })}
    return successResponse({res, data: {user}})
})

export const updateProfile =asyncHandler(
    async(req, res, next) =>{
        const user = await DBService.findByIdAndUpdate({
            model: userModel,
            id: req.user._id,
            data: req.body,
            option: {new: true}
        })
        return successResponse({res, data: {user}})
    }
)

export const updatePassword= asyncHandler(
    async(req, res, next) =>{
        const{oldPassword, password} = req.body
        if(!compareHash({ plainText:  oldPassword , hashValue: req.user.password })){
            return next (new Error("invalid old password", {cause: 404}))
        }
        const user= await DBService.findByIdAndUpdate({
            model :userModel,
            id: req.user._id,
            data: {
                password: generateHash({plainText: password}),
                changCredentialsTime: Date.now()
            },
            option: {new: true}
        })
        return successResponse({res, data: {}})
})

export const updateEmail =asyncHandler(async(req,res,next)=>{
    const { email}=req.body
    if(await DBService.findOne({
        model : userModel ,
        filter: {email}
    }))
    {
        return next(new Error("email exist ",{cause:409}))
    }
    await DBService.updateOne({
        model :userModel,
        filter:{ _id:req.user._id },
        data:{
            tempEmail:email
        }
    })
    emailEvent.emit("updateEmail",{ id:req.user._id , email})
    emailEvent.emit("sendConfirmEmail",{ id:req.user._id , email: req.user.email})
    return successResponse({res, data:{}})
})

export const replaceEmail =asyncHandler(async(req,res,next)=>{
    const { oldEmailCode, code}=req.body
    if(await DBService.findOne({ model : userModel , filter:{email}})){
        return next(new Error("email exist ",{cause:409}))
    }
    if(!compareHash({plainText:oldEmailCode, hashValue: req.user.emailOTP})){
        return next(new Error("please verify old email ",{cause:400}))
    }
    if(!compareHash({plainText:code, hashValue: req.user.updateEmailOTP})){
        return next(new Error("please verify new email ",{cause:400}))
    }
    await DBService.updateOne({
        model:userModel,
        filter:{_id:req.user._id},
        data:{
            email:req.user.tempEmail,
            changCredentialsTime:Date.now(),
            $unset:{
                tempEmail:0,
                updateEmailOTP:0,
                emailOTP:0,
            }
        }
    })
    return successResponse({res, data:{}})
})


// export const updateImage =asyncHandler(async(req,res,next)=>{
//     const user =await DBService.findByIdAndUpdate({
//         model:userModel,
//         id:req.user._id,
//         data:{
//             image:  req.file.finalPath
//         },
//             options:{
//                 new: true
//             }
        
//     })
//     return successResponse({res, data:{user}})
// })


export const  updateImage= asyncHandler(
    async(req, res, next) =>{
        const {secure_url, public_id}= await cloud.uploader.upload(req.file.path,{folder: "user"})
        const user= await DBService.findByIdAndUpdate({
            model: userModel,
            id :req.user._id,
            data:{
                image: {secure_url, public_id}
            },
            option: {new: true}
        })
        return successResponse({res, data: { user}})
})

// export const coverImage =asyncHandler(async(req,res,next)=>{
//     const user =await DBService.findByIdAndUpdate({
//         model:userModel,
//         id:req.user._id,
//         data:{
//             coverImage:  req.files.map(file=>file.finalPath)
//         },
//             options:{
//                 new: true
//             }
        
//     })
//     return successResponse({res, data:{file:req.files,user }})
// })

export const coverImage =asyncHandler(
    async(req, res, next) =>{
        const images = []
        for (const file of req.files) {
            const {secure_url, public_id}= await cloud.uploader.upload(file.path, {folder: "user/cover"})
            images.push({secure_url, public_id})
        }
        

        const user= await DBService.findByIdAndUpdate({
            model:userModel,
            id: req.user._id,
            data:{
                coverImages: images
            }
        })
        return successResponse({res, data: {user}})
})

export const identity = asyncHandler(async(req,res,next)=>{
    const user =await DBService.findByIdAndUpdate({
        model:userModel,
        id:req.user._id,
        data:{
            coverImage:  req.files.map(file=>file.finalPath)
        },
            options:{
                new: true
            }
        
    })
    return successResponse({res, data:{file:req.files, user}})
})

export const dashboard = asyncHandler(
    async(req , res , next ) => {
        const result  = await Promise.allSettled([ await DBService.findAll({
            model: userModel,
            filter:{},
            populate:[{path: "viewer", select : "username email image"}]
        }),
        DBService.findAll({
            model : postModel,
            filter: {},
        })
    ])
        return successResponse({res , data: {result}})
})

export const changeRole = asyncHandler(
    async(req , res , next ) => {
        const {userId}= req.params
        const {role} = req.body
        const roles = req.user.role === roleTypes.superAdmin? {role :{$nin:[roleTypes.superAdmin]}} :{role:{$nin:[roleTypes.admin, roleTypes.superAdmin]}}
        const user  =await DBService.findOneAndUpdate({
            model: userModel,
            filter:{
                _id :userId,
                isDeleted:{$exists: false},
                ...roles
        },
        data:{
            role,
            updatedBy: req.user._id
        },
            populate:[{path: "viewer.userId", select : "username email image"}]
        })
        return successResponse({res , data: {user}})
})

export const viewProfile = asyncHandler(
    async(req, res, next ) =>{
        const {profileId} = req.params
        const user = await DBService.findOne({
            model: userModel,
            filter:{
                _id : profileId,
            }
        })
        if(!user){
        return next (new Error("in valid user profile", {cause: 404}))
        }
        if (user.viewer?.length <5) {
            await DBService.findOneAndUpdate({
                model: userModel,
                filter:{
                _id: profileId,
                isDeleted:{$exists: false}
                },
                data:{
                $push:{viewer:{userId:req.user._id, time: Date.now()}}
                }
            })
        } else {
            notification.emit("sendNotification", { username: user.userName, email: user.email, viewer: user.viewer });

        }
        
        return successResponse({res, data: {user}})
})

export const changePrivilege= asyncHandler(
    async(req, res, next) =>{

        const {userId ,roles} = req.body
        const owner= req.user.role === roleTypes.superAdmin? {}: {
            role:{
            $nin:[roleTypes.admin, roleTypes.superAdmin]
                }}
        const user = await DBService.findOneAndUpdate({
            model: userModel,
            filter:{
                _id:userId,
                isDeleted:{$exists: false},
                ...owner
            },
            data:{
                roles,
                updatedBy:req.user._id
            },
            option:{
                new:true
            }
        })
        return successResponse({res, data:{user}})
})

export const addFriendRequest = asyncHandler(async(req, res, next) =>{
    const {friendId} =req.params
    const checkUser = await DBService.findOne({
        model : userModel,
        filter:{
            _id: friendId
        }
    })
    if (!checkUser) {
        return next(new Error("not found", {cause:404}))
    }
    const request = await DBService.create({
        model :friendRequestModel,
        data:{friendId, createdBy: req.user._id}
        })
    return successResponse({res, data:{request}})
})

export const acceptFriendRequest= asyncHandler(async(req, res, next) =>{
    const {friendRequestId} = req.params
    const friendRequest = await DBService.findOneAndDelete({
        model: friendRequestModel,
        filter:{
            _id:friendRequestId,
            status:false,
            friendId: req.user._id
        }
    })
    if (!friendRequest) {
        return next(new Error("not found", {cause:404}))
    }
        await DBService.updateOne({
        model: userModel,
        filter:{
            _id:req.user._id
        },
        data:{
            $addToSet:{friends: friendRequest.createdBy}
        }
    })
        await DBService.updateOne({
        model: userModel,
        filter:{
            _id: friendRequest.createdBy
        },
        data:{
            $addToSet:{friends: req.user._id}
        }
    })
    return successResponse({res, data:{}})
})