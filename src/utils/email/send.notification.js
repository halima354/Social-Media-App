import nodemailer from 'nodemailer';

export const  subjectTypes={
    notification:"notification",
}

export const sendEmail= async({
    to=[],
    subject="Route",
    html="",
    attachments=[],}={}
)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
        },
    });
        const info = await transporter.sendMail({
                from: `"Route Academy" <${process.env.EMAIL}>`,
                to,
                cc,
                bcc,
                subject,
                text,
                html,
                attachments
                });
            console.log("Message sent: %s", info.messageId);
            }
    
