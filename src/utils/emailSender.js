import nodemailer from "nodemailer"

const sendEmail= async (to,subject,text)=>{

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from:`<${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });

};

const sendVerificationEmail=async(to,verificationCode)=>{
    const subject="Verify Your Email Address";
    const text=`Please verify your email address by entering the following code: ${verificationCode}`;
    await sendEmail(to,subject,text);
};

const sendPasswordResetEmail=async(to,resetToken)=>{
    const subject="Reset Your Password";
    const text=`Please reset your password by clicking the following link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(to,subject,text);
};

export {sendEmail,sendVerificationEmail,sendPasswordResetEmail};