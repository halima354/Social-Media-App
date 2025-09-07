import joi from 'joi'
import { generalFields } from '../../../middelware/validation.middelWare.js'

export const createPost = joi.object().keys({
    content: joi.string().min(2).max(20000).trim(),
    file: joi.object().options({allowUnknown: true})
}).or('content','file')

export const updatePost = joi.object().keys({
    postId:generalFields.id.required(),
    content: joi.string().min(2).max(20000).trim(),
    file: joi.object().options({allowUnknown: true})
}).or('content','file')

export const freezePost = joi.object().keys({
    postId:generalFields.id.required(),
}).required()

export const undoPost = joi.object().keys({
    postId:generalFields.id.required(),
}).required()

export const likePost = freezePost
export const archivePost = undoPost