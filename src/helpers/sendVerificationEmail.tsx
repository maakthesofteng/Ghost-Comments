import { resend } from "@/lib/resend";
import VerificationEmail from "../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";

// const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verification Code",
            react: render(<VerificationEmail username={username} otp={verifyCode} />),
        });

        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending in Verification Email: ", error);
        return { success: false, message: "Failed to send Verification Email" };
    }
}
