import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { userNameValidation } from '@/schema/signUpSchema';

const UserNameQuerySchema = z.object({
    username: userNameValidation,
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        // Configuring query through serachParams
        const { searchParams } = new URL(request.url)

        const queryParams = {
            username: searchParams.get("username"),
        }

        const result = UserNameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.length > 0 ? usernameError.join(', ') : "Inavalid query parameters"
            }, { status: 400 })
        }
        const { username } = result.data;

        // Checking Username Avalibility
        const existingVerifiedUsername = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUsername) {
            return Response.json({
                success: false,
                message: "Username already taken/exists"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 })

    } catch (error) {
        console.error("Error in checking unique username", error)
        return Response.json({
            success: false,
            message: "Error in checking unique username"
        }, {
            status: 500
        })
    }

}