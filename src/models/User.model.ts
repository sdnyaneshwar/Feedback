import mongoose,{Schema,Document, mongo} from 'mongoose'
import { STRING_LITERAL_DROP_BUNDLE } from 'next/dist/shared/lib/constants'

export interface Message extends Document{
    content:string;
    createdAt:Date;

}

const MesssageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now

    }

})


export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    isVerified:boolean;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[]


}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim:true,
        unique:true


    },
    email:{
        type:String,
        required:[true,"Email  is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use valid email address"],
    }
    ,
    password:{
        type:String,
        required:[true,"password is required"],
        
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],

        
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"],
        
    },
    isVerified:{
        type:Boolean,
        default:false,

    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MesssageSchema]

})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel