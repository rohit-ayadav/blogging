import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import User from "@/models/users.models";
import sendOtpModels from "@/models/send-otp.models";
import sendEmail from "@/action/email/SendEmail";
import sendOTP from "@/utils/EmailTemplate/send-otp";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        if (!request.body) { return NextResponse.json({ message: 'Invalid request body' }, { status: 400 }); }
        const { email, name } = await request.json();
        const user = await User.findOne({ email });
        if (user) { return NextResponse.json({ message: 'Email already exists, please login' }, { status: 400 }); }
        const sendOtp = await sendOtpModels.findOne({ email });
        if (sendOtp && !sendOtp.isUsed) {
            const newOtp = crypto.getRandomValues(new Uint32Array(1))[0].toString().substring(0, 6);

            sendEmail({
                to: email,
                subject: 'OTP for Email Verification - Resend',
                message: await sendOTP({ email, otp: newOtp, userName: name })
            });
            const otp = await bcrypt.hash(newOtp, 10);
            await sendOtpModels.findOneAndUpdate({ email }, { otp });
            await sendOtpModels.findOneAndUpdate({ email }, { isUsed: false });
            await sendOtpModels.findOneAndUpdate({ email }, { expiredAt: new Date(Date.now() + 5 * 60 * 1000) });
            return NextResponse.json({ message: 'OTP resent successfully to your email' }, { status: 200 });
        }
        let otp = crypto.getRandomValues(new Uint32Array(1))[0].toString().substring(0, 6);

        sendEmail({
            to: email,
            subject: 'OTP for Email Verification',
            message: await sendOTP({ email, otp, userName: name })
        });

        otp = await bcrypt.hash(otp, 10);

        const newSendOtp = new sendOtpModels({ email, otp });
        await newSendOtp.save();

        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    }
}