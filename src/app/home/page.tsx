"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";


var inpData = 0
export default function Home() {
    useEffect(() => {
      fetch("http://localhost:8080")
      .then((response) => response.json())
      .then((data) => {
          inpData = data.message
          console.log(inpData)
      })
  })

  return (
    <>
        inpData

        <button className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200">
            <span onClick={() => signOut({redirect: true, callbackUrl: "/"})}>Logout</span>
        </button>
    </>
  );
}