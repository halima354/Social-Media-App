import { Router } from "express";
const router= Router()
import *as userService from './services/user.service.js'
import { authentication, authorization } from "../../middelware/auth.middelware.js";
import { validation } from "../../middelware/validation.middelWare.js";
import * as validators from './services/user.validation.js'
import { uploadDiskFile } from "../../utils/multer/local multer.js";
import { fileValidationTypes } from "../../utils/multer/local multer.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoint } from "./services/user.authorization.js";
router.get('/profile',  authentication(),userService.getProfile)

router.get('/profile/:friendId/addRequest',  authentication(),userService.addFriendRequest)
router.patch('/profile/:friendRequestId/acceptRequest',  authentication(),userService.acceptFriendRequest)

router.get('/profile/:profileId', validation(validators.shareProfile),authentication(),userService.shareProfile)

router.patch('/updateProfile',  validation(validators.updateProfile), authentication(),userService.updateProfile)

router.patch('/updatePassword',  validation(validators.updatePassword), authentication(),userService.updatePassword)

router.patch('/profile/email',  validation(validators.email), authentication(),userService.updateEmail)

router.patch('/replaceEmail',  validation(validators.replaceEmail), authentication(),userService.replaceEmail)

router.patch('/profile/image',
    authentication(),
   // uploadDiskFile("general", fileValidationTypes.image).single("image"),
    uploadCloudFile(fileValidationTypes.image).single("image"),
    userService.updateImage)

router.patch('/profile/image/cover',
    authentication(),
   // uploadDiskFile("general/cover",fileValidationTypes.image).array("image",5),
    uploadCloudFile( fileValidationTypes.image).array("image",5),
    userService.coverImage)

router.patch("/profile/identity",
    authentication(),
    uploadDiskFile("general/cover",[...fileValidationTypes.image, fileValidationTypes.document[1]])
    .fields([{name:"image", maxCount:1},{name:"document", maxCount:1}]),userService.identity)

// router.patch('/profile/identity',
// authentication(),
// uploadDiskFile("general/identity",[...fileValidationTypes.image,fileValidationTypes.document[1]])
// .fields([{name:"image",maxCount:1},{name:"document",maxCount:1}]),
// userService.identity)

router.get('/dashboard',  authentication(),userService.dashboard)
router.patch('/:userId/profile/dashboard/role',  authentication(),userService.changeRole)
router.get('/profile/:profileId/view', validation(validators.shareProfile),authentication(),userService.viewProfile)
router.patch('/changPrivilege', authentication(), 
authorization(endPoint.admin),
userService.changePrivilege)

export default router