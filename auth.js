// auth.js
import { getServerSession } from "next-auth";
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import User from '@/models/users.models';
import { rateLimit } from "@/utils/rate-limit";
import sendEmail from "./action/email/SendEmail";
import { LoginSuccessEmailTemplateF, SignUpEmailTemplate } from "./utils/EmailTemplate/auth";

export const authOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials, req) {
                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const isAllowed = rateLimit(ip);

                if (!isAllowed) {
                    throw new Error('Too many login attempts. Please try again later.');
                }

                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('User not found');
                }
                const isValid = await user.comparePassword(credentials.password);

                if (!isValid) {
                    throw new Error('Invalid credentials');
                }

                // Return full user object with _id
                return {
                    id: user._id.toString(), // Make sure to include id
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    provider: 'credentials'
                };
            },
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 5 * 24 * 60 * 60, // 5 days
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.provider = user.provider;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {

            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.provider = token.provider;
                session.user.role = token.role;
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            const { email } = user;

            try {
                // Send email
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    existingUser.provider = account?.provider || existingUser.provider;
                    if (profile) {
                        existingUser.image = profile.picture || profile.avatar_url || existingUser.image;
                    }
                    await existingUser.save();
                    await sendEmail({
                        to: email,
                        subject: "New Login Alert 🚨 | Dev Blog",
                        message: LoginSuccessEmailTemplateF({
                            name: user.name,
                            loginTime: new Date(),
                            location: 'Progressive Web App',
                        }),
                    });
                    return true;
                }

                const newUser = {
                    name: profile.name || profile.login || null,
                    email: email,
                    image: profile.picture || profile.avatar_url || null,
                    provider: account.provider,
                    providerId: profile.id,
                    role: "user",
                };

                await User.create(newUser);
                sendEmail({
                    to: email,
                    subject: "Registration successful ✔ | Dev Blog 🚀",
                    message: SignUpEmailTemplate({
                        name: newUser.name,
                        email: newUser.email,
                    }),
                });
                return true;
            } catch (error) {
                console.error(`Error sending email: ${error}`);
                return false;
                // return true; // Continue sign in process
            }
        },
    },
};


export async function getSessionAtHome() {
    return await getServerSession(authOptions);
}