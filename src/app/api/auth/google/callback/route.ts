// app/login/google/callback/route.ts
import { google, lucia } from "@/auth";
import User from "@/lib/db/models/user";
import dbConnect from "@/lib/db/mongoose";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
    await dbConnect();
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("google_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, process.env.OAUTH_CODE_VERIFIER as string);

        const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const googleUser: GoogleUser = await googleUserResponse.json();

        let user = await User.findOne({ email: googleUser.email });

        let userId: string;

        if (!user) {
            userId = generateIdFromEntropySize(10); // 16 characters long
            user = new User({
                _id: userId,
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                emailVerified: googleUser.verified_email
            });
            await user.save();
        } else {
            userId = user.id;
        }

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (e) {
        console.log(e)
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}