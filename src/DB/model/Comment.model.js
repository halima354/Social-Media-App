import mongoose,{ Schema, Types, model } from "mongoose";

const commentSchema= new Schema({
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
    likes:[{type: Types.ObjectId, ref: "User"}],
    tags:[{type: Types.ObjectId, ref: "User"}],
    userId:{type: Types.ObjectId, ref:"User", require: true},
    postId:{type: Types.ObjectId, ref:"Post", require: true},
    attachments:[{secure_url: String, public_id:String }],
    deletedBy:{type:Types.ObjectId, ref : "User" },
    updatedBy:{type : Types.ObjectId, ref : "User"}
    //coverImages:[{secure_url:String, public_id: String}],
    
}
,{timestamps: true})
const commentModel = mongoose.models.comment || model("Comment", commentSchema)
export default commentModel
