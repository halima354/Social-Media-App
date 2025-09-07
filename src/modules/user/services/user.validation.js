import joi from 'joi'
import { generalFields } from '../../../middelware/validation.middelWare.js'

export const shareProfile= joi.object().keys({
    profileId: generalFields.id.required()
}).required()

export const updateProfile= joi.object().keys({
    //username:generalFields.username,
    DOB:generalFields.DOB,
    Phone:generalFields.phone,
    gender:generalFields.gender
}).required()

export const updatePassword= joi.object().keys({
        oldPassword: generalFields.password.required(),
        password: generalFields.password.not(joi.ref("oldPassword")).required(),
        confirmationPassword: generalFields.confirmationPassword.valid(joi.ref("password")).required()
}).required()

export const email= joi.object().keys({
    email:generalFields.email.required(),
}).required()

export const replaceEmail= joi.object().keys({
    oldEmailCode:generalFields.code.required(),
    code:generalFields.code.required(),
    email:generalFields.email.required(),
}).required()