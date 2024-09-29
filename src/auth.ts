import { Lucia } from 'lucia';
import { Google } from "arctic";
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Session, User } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import mongoose from 'mongoose';

import dbConnect from '@/lib/db/mongoose';

const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const redirectURI = process.env.GOOGLE_REDIRECT_URI as string;

export const google = new Google(clientId, clientSecret, redirectURI);

// adapter for lucia
export const adapter = new MongodbAdapter(
    mongoose.connection.collection('sessions'),
    mongoose.connection.collection('users')
);

console.log(process.env.MONGODB_URI)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false,
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes: any) => {
        return {
            email: attributes.email,
            emailVerified: attributes.emailVerified
        };
    },
});

// This will check for the session cookie, validate it, and set a new cookie if necessary. 
export const validateRequest = cache(
    async (): Promise<
        { user: User; session: Session } | { user: null; session: null }
    > => {
        await dbConnect()
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
            return {
                user: null,
                session: null,
            };
        }

        const result = await lucia.validateSession(sessionId);
  
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
        } catch {
            console.log("catch block")
        }
        return result;
    }
)

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}