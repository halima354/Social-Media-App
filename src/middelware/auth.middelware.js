import { asyncHandler } from "../utils/response/error.response.js";
import { decodedToken } from "../utils/security/token.security.js";

export const authentication= () => {
    return asyncHandler(async (req, res, next) => {
    req.user= await decodedToken({ authorization: req.headers.authorization, next })
    return next()
})
}

export const authorization= (accessRoles=[])=>{
    return asyncHandler(async(req,res,next)=>{
        if(!accessRoles.includes(req.user.roles)){
        return next(new Error("not authorize account",{cause:403}))
        }
    return next()
})
}


// export const authentication = () => {
//     return asyncHandler(async (req, res, next) => {
//     try {

//         req.user = await decodedToken({ authorization: req.headers.authorization });
//         return next();
//     } catch (error) {

//         return next(new Error("Authorization failed", { cause: 401 }));
//     }
//     });
// };