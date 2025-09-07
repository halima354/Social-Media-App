import { Router } from "express";
import * as commentService from './service/comment.service.js'
import * as validators from './service/comment.validation.js'
import { authentication, authorization } from "../../middelware/auth.middelware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { fileValidationTypes } from "../../utils/multer/local multer.js";
import { validation } from "../../middelware/validation.middelWare.js";
import { endPoint } from "./service/comment.authorization.js";
const router= Router({mergeParams: true})

router.post('/create',authentication(),
    //authorization(endPoint.create),
    uploadCloudFile(fileValidationTypes.image).array("attachment",2),
    validation(validators.createComment),
    commentService.createComment )

router.patch('/:commentId',authentication(),
    //authorization(endPoint.create),
    uploadCloudFile(fileValidationTypes.image).array("attachment",2),
    validation(validators.updateComment),
    commentService.updateComment )

router.delete('/:commentId',authentication(),
    //authorization(endPoint.freeze),
    validation(validators.freezeComment),
    commentService.freezeComment )

router.patch('/:commentId/restore',authentication(),
    //authorization(endPoint.freeze),
    validation(validators.freezeComment),
    commentService.unfreezeComment )
export default router