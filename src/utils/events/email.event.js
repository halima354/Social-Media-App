import { EventEmitter } from "node:events";
import { nanoid, customAlphabet } from "nanoid";
import { sendEmail,subjectTypes } from "../email/send.email.js";
import { verificationEmailTemplate } from "../email/template/verfication.email.js";
import { generateHash } from "../security/hash.security.js";
import userModel from '../../DB/model/User.model.js'
import * as DBService from '../../DB/DBservice.js'
import { hash } from "node:crypto";
export const emailEvent= new EventEmitter({})


const sendCode= async({data, subject=subjectTypes.confirmEmail}={})=>{
    const {id ,email}=data
    const otp = customAlphabet("0123456789",4)()
    const html= verificationEmailTemplate({code: otp})
    const hash= generateHash({plainText:otp})
    let dataUpdate = {};
    switch (subject) {
        case subjectTypes.confirmEmail:
            dataUpdate={emailOTP:hash}
            break;
        case subjectTypes.resetPassword:
                dataUpdate={forgetPasswordOTP:hash}
                break;
        case subjectTypes.updateEmail:
                    dataUpdate={updateEmailOTP:hash}
                    break;
        default:
            break;
    }
    await DBService.updateOne({
        model :userModel,
        filter:{_id :id},
        data: dataUpdate
    
    })
await sendEmail({to:email, subject, html})
console.log("email sent");
}

emailEvent.on("sendConfirmEmail", async(data)=>{
    await sendCode({data, subject:subjectTypes.confirmEmail})
    console.log("email sent");
    
})

emailEvent.on("updateEmail", async(data)=>{
    await sendCode({data, subject:subjectTypes.updateEmail})
    console.log("email sent");
    
})

emailEvent.on("sendForgetPassword", async(data)=>{
    await sendEmail({to:email, subject:subjectTypes.resetPassword})
    console.log("email sent");
    
})



// emailEvent.on("sendProfileViewNotification", async(data) => {
//     // Get the list of view attempts for the profile (should be an array of {userId, time})
//     const profileOwner = await DBService.findOne({
//         model: userModel,
//         filter: { _id: profileId }
//     });

//     // Extract the viewing times from the viewer array (only the last 5)
//     const viewingTimes = profileOwner.viewer.map(view => view.time).slice(-5);

//     // Prepare the email body
//     const html = `User ${req.user.username} has viewed your account 5 times at these time periods: ${viewingTimes.join(", ")}`;

//     // Send the email
//     await sendEmail({
//         to: data.email, // Profile owner's email
//         subject: "Profile View Notification",
//         html
//     });

//     console.log("Profile view notification email sent");
// });
