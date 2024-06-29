import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbconnect";
import { z } from "zod";
import { usernameValidation } from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object(
    {
        username: usernameValidation,

    }
)

export async function GET(request: Request) {
    


    await dbConnect()
    try {

        const { searchParams } = new URL(request.url)
        //http:localhost:3000/api/cuu?username=dany?phone=android


        const queryParam = {
            username: searchParams.get("username")
        }
        //validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result);   //todo remove
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ')
                    : "Invalid query parameter"

            },
                {
                    status: 400
                })
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username, isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "username is already taken"
            },
                {
                    status: 400
                })
        }

        return Response.json({
            success: true,
            message: "username is unique"
        },
            {
                status: 400
            })


    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"

        },
            {
                status: 500

            }
        )


    }
}