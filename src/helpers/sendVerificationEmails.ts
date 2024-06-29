import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string,
    username:string,
    verifycode:string
):Promise<ApiResponse>{

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Feedback app |  verification code',
            react: VerificationEmail({username,otp:verifycode}),
          });

        return {success:true,message:"verification email send successfully"}
        
        
    } catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {success:false,message:"faild to send verification email"}
        
    }
    
}