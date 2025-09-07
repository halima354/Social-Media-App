import mongoose,{ Schema, Types, model } from "mongoose";
import { type } from "node:os";
const postSchema= new Schema({
    content:{
        type:String,
        require:function(){
            return this.attachments?.length? false: true
        },
        maxlength:20000,
        minlength:2,
        trim:true
    },
    isDeleted: Date,
    archiveLists:[{type: Types.ObjectId, ref: "User"}],
    likes:[{type: Types.ObjectId, ref: "User"}],
    tags:[{type: Types.ObjectId, ref: "User"}],
    userId:{type: Types.ObjectId, ref:"User", require: true},
    attachments:[{secure_url: String, public_id:String }],
    updatedBy:{type:Types.ObjectId, ref :"User" },
    deletedBy:{type:Types.ObjectId, ref :"User" },
    //coverImages:[{secure_url:String, public_id: String}],
    isPublic:{
        type:Boolean,
        default:true
    }
    
}
,{timestamps: true})
const postModel = mongoose.models.Post || model("Post", postSchema)
export default postModel
