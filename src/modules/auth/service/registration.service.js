import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js"
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import*as DBService from '../../../DB/DBservice.js'

export const signup = asyncHandler (
    async (req, res, next) => {
    const{username, password, email}=req.body
    console.log({username,password,email});
    if(await userModel.findOne({email})){
        return next(new Error("email exist",{cause:409}))
    }
    const hashPassword= generateHash({plainText:password})
    const user= await DBService.create({
        model:userModel, data:{username,email,password:hashPassword}
    })
    emailEvent.emit('sendConfirmEmail',{id :user._id ,email})
    return successResponse({res, status:201, data:{user} })
}
)

export const confirmEmail = asyncHandler(
    async(req,res,next)=>{
        const {email,code}=req.body
        console.log({email,code});
        const user= await userModel.findOne({email})
        if(!user){
            return next(new Error("not exist",{cause:404}))
        }
        if(user.confirmEmail){
            return next(new Error("already confirmed", {cause:409}))
        }
        if(!compareHash({plainText:`${code}`, hashValue:user.emailOTP})){
            return next(new Error("in-valid OTP",{cause:404}))
        }
        await userModel.updateOne({email}, {confirmEmail:true , $unset:{emailOTP:0}})
        return successResponse({res, status:200, data:{user} })
    }
    
)




