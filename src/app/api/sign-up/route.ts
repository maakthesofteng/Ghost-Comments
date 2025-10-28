import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcrypt'
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        // Checking existing Verified User with their username
        const verifiedUserByUsername = await UserModel.findOne({ username, isVerified: true })

        if (verifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already exists"
            }, {
                status: 400
            })
        }

        // Now checking Existing user with Email
        const existingUserWithEmail = await UserModel.findOne({ email })

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserWithEmail) {
            // Checking if user is already present and verified with this email
            if (existingUserWithEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this Email"
                }, {
                    status: 400
                })
            } else {
                // Now this section is for user is already present but not verified yet
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserWithEmail.password = hashedPassword;
                existingUserWithEmail.verifyCode = verifyCode;
                existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserWithEmail.save();
            }
        } else {
            // Saving new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        // Checking if already email is sent to this user
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, {
                status: 500
            })
        }
        // Now for first time verification email is going to be send
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please Verify your account"
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error in Registering new User", error)
        return Response.json({
            success: false,
            message: 'Error in Registering New User'
        }, {
            status: 500
        })
    }
}