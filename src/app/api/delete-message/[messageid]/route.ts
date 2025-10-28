import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { _superRefine } from "zod/v4/core";


export async function DELETE(request: Request, {params,} : {params : {messageid : string}}) {
    await dbConnect();

    const messageId = params.messageid;
    // Extracting sessions values
    const session = await getServerSession(authOptions)
    const _user: User = session?.user 

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User Not Authenticated "
        }, { status: 401 })
    }

    try {
        const deletedMessage = await UserModel.updateOne({_id : _user._id}, { $pull : {messages : {_id: messageId}}})

        if(deletedMessage.modifiedCount === 0){
            return Response.json({
            success: false,
            message: 'Message not found or already deleted',
          },
        { status: 404 }
      );
        } 

        return Response.json({
            success : true,
            message : 'Message Deleted Successfully'
        },{status : 201})
    } catch (error) {
        return Response.json({
            success : false,
            message : 'Message deletion request Failed due to some error'
        },{status : 500})
    }
}