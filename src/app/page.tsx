import {
  GoogleSignInButton,
} from "@/auth/authButtons";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth/NextAuth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);

  if (session) return redirect("/home");

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
        <GoogleSignInButton />
    </div>
  );
}