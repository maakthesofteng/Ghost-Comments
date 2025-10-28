import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 500 })
        }

        const isCodeVerified = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired && isCodeVerified) {
            // Check given code and expirey is valid
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User is Verified",
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            //Check If code is Expired
            return Response.json({
                success: false,
                message: "Code is Expired. Please SignUp again for new code"
            }, { status: 500 })
        } else {
            // Check if code is not valid
            return Response.json({
                success: false,
                message: "Given code is Incorrect. Enter correct code"
            }, { status: 500 })
        }

    } catch (error) {
        console.error("Error in user Verification")
        return Response.json({
            success: false,
            message: "Error in user Verification"
        }, { status: 500 })
    }
}