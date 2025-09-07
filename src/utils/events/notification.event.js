import EventEmitter from 'node:events'
import { sendEmail, subjectTypes } from '../email/send.notification.js'
import { profileViewNotificationTemplate } from '../email/template/notificatio.temp.js'
export const notification = new EventEmitter()
notification.on("sendNotification", async(data) =>{
    const notifications= await sendEmail({
        to : data.email,
        subject: subjectTypes.notification,
        html: profileViewNotificationTemplate(data.userName, data.viewer)
    })
    
})