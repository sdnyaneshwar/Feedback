import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbconnect";

import UserModel from "@/models/User.model";
import bcryptjs from 'bcryptjs'
import { log } from "console";


export async function POST(request:Request) {

    await dbConnect();
    try {
        
        const {username,email,password} = await request.json()

        console.log(username,"  ",email,"  ",password);
        
         const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true})

         if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Unername is aready taken"
            },{
                status:400

            })

         }


        const existingUserByEmail = await  UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() + 900000).toString()



        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message: "User aready exist with this email"
    
                },{
                    status:400
                })
    
            }
            else{
                const hashedPassword = await bcryptjs.hash(password,20)

                existingUserByEmail.password = hashedPassword

                existingUserByEmail.verifyCode =verifyCode

                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)


                await existingUserByEmail.save()
            }

        }
        else{
            const hashedPassword  = await bcryptjs.hash(password,10)
            const expiryDate =new Date()
            expiryDate.setHours(expiryDate.getHours()+1)


            const newUser = new  UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                isVerified:false,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[]
            
            })


            await newUser.save()
        }



        //send verification email
        
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        console.log(emailResponse);
        
        if(!emailResponse.success)
            {
                return Response.json({
                    success : false,
                    message: emailResponse.message

                },{
                    status:500
                })
            }


            return Response.json({
                success : true,
                message: "User register successfully , please verify your email"

            },{
                status:201
            })



    } catch (error) {
        console.error("Error registering user",error);
        return Response.json({
            success:false,
            message:"Error regiseting user"

        },{
            status:500
        })
    }
    
}