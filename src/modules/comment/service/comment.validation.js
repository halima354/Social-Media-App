import joi from 'joi'
import { generalFields } from '../../../middelware/validation.middelWare.js'

export const createComment = joi.object().keys({
    postId:generalFields.id.required(),
    content: joi.string().min(2).max(20000).trim(),
    file: joi.object().options({allowUnknown: true})
}).or('content','file')

export const updateComment = joi.object().keys({
    postId:generalFields.id.required(),
    commentId:generalFields.id.required(),
    content: joi.string().min(2).max(20000).trim(),
    file: joi.object().options({allowUnknown: true})
}).or('content','file')

export const freezeComment = joi.object().keys({
    commentId:generalFields.id.required(),
    postId:generalFields.id.required(),
}).required()

//export const likePost = freezePost