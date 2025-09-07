import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js'

export const tokenTypes={
    access:'access',
    refresh:'refresh'
}


export const decodedToken = async({authorization= "", tokenType=tokenTypes.access, next}={})=>{

    //const {authorization}= req.headers
        console.log({authorization});
    if(!authorization){
        return next( new Error( "authorization is required" , {cause : 400}))
    }
        const[bearer,token]= authorization.split(" ") || []
        if(!bearer|| !token){
            return next(new Error("authorization is require or in-valid format",{cause:400}))
        }
    
        let AccessSignature= ""
        let RefreshSignature= ""
    
        switch(bearer){
            case "System":
                AccessSignature =process.env.SYSTEM_ACCESS_TOKEN
                RefreshSignature =process.env.SYSTEM_REFRESH_TOKEN
                break;
    
            case "Bearer":
                AccessSignature= process.env.USER_ACCESS_TOKEN
                RefreshSignature= process.env.USER_REFRESH_TOKEN
                break;
    
            default:
                    break;
        }
        const decoded = verifyToken({token , signature:tokenType ===tokenTypes.access? AccessSignature: RefreshSignature})
        console.log(decoded);
        
        if(!decoded?.id){
            return next(new Error("in-valid token payload",{cause:401}))
        }
        const user= await userModel.findOne({_id : decoded.id, isDeleted:false})
        if(!user){
            return next(new Error("in-valid account",{cause:404}))
        }
        if(user.changCredentialsTime?.getTime() >= decoded.iat*1000){
            return next(new Error("in-valid Credentials",{cause:400}))
        }
        return user
    }
export const generateToken= ({payload={}, signature=process.env.USER_ACCESS_TOKEN, expiresIn=parseInt(process.env.expiresIn)}={})=>{
const token= jwt.sign(payload , signature, {expiresIn})
return token
}

export const verifyToken= ({token="", signature=process.env.USER_ACCESS_TOKEN}={})=>{
    const decoded= jwt.verify(token, signature)
    return decoded
}
