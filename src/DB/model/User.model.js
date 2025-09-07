import  types  from "joi";
import mongoose,{ Schema, Types, model } from "mongoose";
import { type } from "node:os";

export const genderTypes ={female:"female", male: 'male'}
export const roleTypes ={user:"user", admin: 'admin', superAdmin: "superAdmin"}
const userSchema= new Schema({
    userName:{
        type:String,
        require:true,
        maxlength:2,
        minlength:25,
        trim:true
    },
    email:{
        type:String,
        unique:true ,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmEmail:{
        type:Boolean,
        default:false

    },
    isDeleted:{
        type:Boolean,
        default:false

    },
    gender:{
        type:String,
        enum: Object.values(genderTypes),
        default:genderTypes.male
    },
    roles:{
        type:String,
        enum: Object.values(roleTypes),
        default:roleTypes.user
    },
    viewer:[{userId: { type : Types.ObjectId, ref: 'User'}, time:Date}],
    friends:[{type:Types.ObjectId , ref: "User" }],
    phone:String,
    DOB:Date,
    //image: String,
    image: {secure_url:String, public_id: String},
    //coverImage:[String],
    coverImages:[{secure_url:String, public_id: String}],
    changCredentialsTime: Date,
    emailOTP:String,
    updateEmailOTP:String,
    tempEmail:String,
    forgetPasswordOTP:String,
    updatedBy:{ type : Types.ObjectId, ref: 'User'},
    friends:[{type:Types.ObjectId ,ref: "User"}]
}
,{timestamps: true})
const userModel = mongoose.models.User || model("User", userSchema)
export default userModel
