import { Router } from "express";
import { authentication, authorization } from "../../middelware/auth.middelware.js";
import { fileValidationTypes, uploadDiskFile } from "../../utils/multer/local multer.js";
import * as postService from './services/post.service.js'
import * as validators from './services/post.validation.js'
import { endPoint } from "./services/post.authorization.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { validation } from "../../middelware/validation.middelWare.js";
import commentController from '../../modules/comment/comment.controller.js'
const router= Router()

router.use("/:postId/comment", commentController)

router.post('/createPost',authentication(),
    authorization(endPoint.createPost),
    uploadCloudFile(fileValidationTypes.image).array("image", 2),
    validation(validators.createPost),
    postService.createPost)

router.patch('/:postId',authentication(),
    authorization(endPoint.createPost),
    uploadCloudFile(fileValidationTypes.image).array("image", 2),
    validation(validators.updatePost),
    postService.updatePost)

router.delete('/:postId',authentication(),
    authorization(endPoint.freeze),
    validation(validators.freezePost),
    postService.freezePost)

router.patch('/:postId/restore',authentication(),
    authorization(endPoint.freeze),
    validation(validators.freezePost),
    postService.restorePost)

router.patch('/:postId/like',authentication(),
    authorization(endPoint.likePost),
    validation(validators.likePost),
    postService.likePost)

router.patch('/:postId/unlike',authentication(),
    authorization(endPoint.likePost),
    validation(validators.likePost),
    postService.unlikePost)

router.get('/',
    authentication(),
    postService.getPosts)

router.patch('/:postId/undoPost',authentication(),
    authorization(endPoint.undoPost),
    validation(validators.undoPost),
    postService.undoPost)

router.get('/friend',
    authentication(),
    authorization(endPoint.undoPost),
   // validation(validators.retrievePost),
    postService.retrieveFriendPost)

router.patch('/:postId/archivePost',
    authentication(),
    authorization(endPoint.archivePost),
    validation(validators.archivePost),
    postService.archivePost)
export default router