import { Router } from "express";
import * as chatService from './services/chat.service.js'
import { authentication } from "../../middelware/auth.middelware.js";
const router = Router()
router.get("/:friendId", authentication(), chatService.getChat)
export default router