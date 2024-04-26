"use server";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "#auth";

export const signIn = async () => await nextAuthSignIn("google");
export const signOut = async () => await nextAuthSignOut();
