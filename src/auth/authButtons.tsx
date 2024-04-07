"use client";
import { signIn } from "next-auth/react";
import Image from "next/image"
import { useRef } from "react";

export function GoogleSignInButton() {
    const handleClick = () => {
      signIn("google");
    };
  
    return (
        <button
          className="btn btn-lg btn-accent h-full items-center text-2xl font-poppins"
          onClick={handleClick} >
          <Image src="/google_icon.svg" alt="Google Icon" width={80} height={58}/>
          <div>Continue with Google</div>
        </button>
    );
  }