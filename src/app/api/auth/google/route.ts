// api/auth/google/route.ts
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { google } from "@/auth";

/**
 * Generate a new state, 
 * create a new authorization URL with createAuthorizationURL(), 
 * store the state, and redirect the user to the authorization URL. 
 * The user will be prompted to sign in with Google. 
 * @docs https://lucia-auth.com/tutorials/github-oauth/nextjs-app
 * @docs https://arctic.js.org/providers/google
 */

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = process.env.OAUTH_CODE_VERIFIER as string;

    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ['email', 'profile']
    });

    cookies().set("google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    return Response.redirect(url);
}