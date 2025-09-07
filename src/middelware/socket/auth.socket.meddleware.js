import { tokenTypes, verifyToken } from "../../utils/security/token.security.js";
import userModel from "../../DB/model/User.model.js";
export const authenticationSocket = async({socket ={}= {}, tokenType = tokenTypes.access, next}={})=>{
    if (!authorization) {
        return { data: { message: "authorization is required", status: 400 } };
    }
    const [bearer, token] = socket?.handshake?.auth?.authorization?.split(" ") || [];
    if (!bearer || !token) {
        return { data: { message: "Authorization header is missing or invalid", status: 400 } };
    }
    console.log("Authorization bearer:", bearer, "Token:", token);
        let AccessSignature= ""
        let RefreshSignature= ""

        switch(bearer){
            case "System":
                AccessSignature =process.env.TOKEN_SIGNATURE_ADMIN
                RefreshSignature =process.env.SYSTEM_REFRESH_TOKEN

                break;
    
            case "Bearer":
                AccessSignature= process.env.USER_ACCESS_TOKEN
                RefreshSignature= process.env.USER_REFRESH_TOKEN
                break;
    
            default:
                    break;
        }
        const decoded = verifyToken({token , signature: tokenType ===tokenTypes.access? AccessSignature: RefreshSignature})
        console.log(decoded);
        if(!decoded?.id){
        
            return {data:{ message: "in-valid token payload" , status: 401} }
        }
        const user= await userModel.findOne({_id : decoded.id, isDeleted:false})
        if(!user){

            return {data:{ message: "in-valid account" , status: 404} }
        }
        if(user.changCredentialsTime?.getTime() >= decoded.iat*1000){
            
            return {data:{ message: "in-valid Credentials" , status: 403} }
        }
        return { data : {message: "done" , user } ,valid :true }
        
    }

export const authorization=async ({accessRoles=[], role}={} )=>{
        if(!accessRoles.includes(role)){
            throw new Error("not authorize account")
        }
    return true
    }