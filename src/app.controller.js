import connectDB from './DB/connection.js'
import path from 'node:path'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import postController from './modules/post/post.controller.js'
import chatController from './modules/chat/chat.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import cors from 'cors'
const limiter = rateLimit({
    limiter:1000,
    windowMs: 2*60*1000,
    legacyHeaders: false,
    standardHeaders: "draft-8"
})
const bootstrap = (app, express) => {
    //app.use("/post",limiter)
    app.use(cors())

    app.use(morgan("dev"))
    app.use(limiter)
    app.use(helmet())
    app.use(express.json())
    app.use('/uploads',express.static(path.resolve('./src/uploads')))
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/post", postController)
    app.use("/chat", chatController)

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" ,})
    })

    app.use(globalErrorHandling)
    connectDB()
}

export default bootstrap


