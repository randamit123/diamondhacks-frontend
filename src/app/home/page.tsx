
"use client"
import React, { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import WebcamStream from "../components/webcamComponent"

export default function Home() {

  return (
    <>
      <WebcamStream></WebcamStream>
      <button
        className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200"
        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
      >
        Logout
      </button>
    </>
  );
  
}