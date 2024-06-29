import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbconnect";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";


export async function POST(request:Request){
    await dbConnect()
    try {

        const {username ,code}  = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found "
            },{status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified =true;
            await user.save()

            return Response.json({
                success:true,
                message:"Account Verified successfully "
            },{status:200})

        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verification code has expired, please sign up again to get new code "

            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Incorrect verification code"

            },{status:400})
        }

    } catch (error) {
        console.log("Error verifying user",error);

        return Response.json({
            success:false,
            message:"Error verifying User "
        },{status:500})
    }
}