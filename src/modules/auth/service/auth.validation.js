import joi  from 'joi'
import { generalFields } from '../../../middelware/validation.middelWare.js'
export const signup =joi.object().keys({
    username:generalFields.username.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmationPassword:generalFields.confirmationPassword.valid(joi.ref('password')).required()
}).required()

export const confirmEmail =joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required()
}).required()

export const login =joi.object().keys({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
}).required()

export const forgetPassword =joi.object().keys({
    email:generalFields.email.required(),
    
}).required()

export const resetPassword =joi.object().keys({
    code:generalFields.code.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    confirmationPassword:generalFields.confirmationPassword.valid(joi.ref('password')).required()
}).required()
