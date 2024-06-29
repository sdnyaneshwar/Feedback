import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json()
    try {
        const user =await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
    
            },{status:404})
        }

        //is user accepting the message

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting the messages"

    
            },{status:401})
        }

        const newMessage = {content ,createdAt:new Date()}

        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"Message send successfully"

        },{status:401})

   } catch (error) {
    console.log("Error adding messages", error );
    
    return Response.json({
        success:false,
        message:"Internal sever error"

    },{status:500})
    }
}