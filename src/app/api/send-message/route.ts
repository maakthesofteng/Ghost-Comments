import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec()

        if (!user) {
            return Response.json({
                success: false,
                message: "User not Found"
            }, { status: 404 })
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages for now"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
            success: true,
            message: "Message Sent Successfully"
        }, { status: 201 })

        
    } catch (error) {
        console.error("Error in sending messages from user", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }
}