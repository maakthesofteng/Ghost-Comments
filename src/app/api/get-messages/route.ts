import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { error } from "console";


export async function GET(request: Request) {
    await dbConnect();

    // Extracting sessions values
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    // Converting userId from string 
    const userId = new mongoose.mongo.ObjectId(user._id)
    try {
        // Making Aggregating pipeline
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        // Check user is found or not
        if (!user || user.length === 0) {
            console.error('Error user not found from get-message api',error)
            return Response.json({
                message: 'User not found',
                success: false
            },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
        
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}