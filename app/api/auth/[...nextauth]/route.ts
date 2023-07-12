import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { Session } from 'next-auth';

import User from "@/models/User";
import { connectToDB } from "@/utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ session }: { session: Session }) {
            const sessionUser = await User.findOne({
                email: session.user?.email!
            });

            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                const userExists = await User.findOne({ email: profile?.email });

                if (!userExists) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replaceAll(' ', '').toLowerCase(),
                        image: profile?.picture
                    });
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
});

export { handler as GET, handler as POST };