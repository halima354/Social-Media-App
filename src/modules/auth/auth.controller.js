import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import { validation } from '../../middelware/validation.middelWare.js';
import * as validators from "../../modules/auth/service/auth.validation.js"
import * as loginService from "./service/login.service.js"
const router = Router();


router.post("/signup", validation(validators.signup), registrationService.signup)
router.patch("/confirmEmail", validation(validators.confirmEmail), registrationService.confirmEmail)
router.post("/login", validation(validators.login), loginService.login)
router.get("/refreshToken",loginService.refreshToken)
router.patch("/forgetPassword",validation(validators.forgetPassword),loginService.forgetPassword)
router.post("/resetPassword",validation(validators.resetPassword),loginService.resetPassword)
export default router