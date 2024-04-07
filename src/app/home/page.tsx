"use client"
import React, { useEffect, useState } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import FlaskAppIframe from "../components/flaskOverlay";
import Image from "next/image";

export function HomeWithSessionProvider() {
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (session?.user) {
      setProfilePicture(session.user.image || '');
      setUserName(session.user.name || '');
    }
  }, [session]);

  return (
    <div className="join join-vertical justify-center items-center w-full h-screen bg-gradient-to-br from-[#f3f4f6] from-10% via-[#93c5fd] via-60% to-[#0891b2] to-2000%">
      <div className="navbar mb-5 bg-base-100 h-1/10 border-2">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Tutorial</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <button className="btn btn-ghost text-2xl justify-center items-center h-full">
            <a>ReSign</a>
            <Image className="" src="/small-logo.png" alt="Small Logo" width={60} height={60}></Image>
          </button>
        </div>
        <div className="navbar-end">
          <div className="chat chat-end w-full justify-end">
            <div className="join join-horizontal h-full space-x-2 justify-center items-center">
              <div className="dropdown dropdown-bottom pt-1">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-full rounded-full">
                    <img alt="Profile Picture" src={profilePicture || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li onClick={() => signOut({ redirect: true, callbackUrl: "/" })}><a>Logout</a></li>
                </ul>
              </div>
              <div className="chat chat-bubble h-3/5 text-nowrap">Welcome, {userName || 'Guest'}!
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="join join-horizontal justify-center items-center h-full w-full">
        <div className="card w-5 h-full opacity-100"></div>
        <FlaskAppIframe></FlaskAppIframe>
        <div className="card w-10 h-full opacity-100"></div>
        <div className="card bg-base-100 w-full h-4/6 opacity-100 p-8">
          <a className="text-2xl pb-6">Output:</a>
          <div className="card bg-base-200 w-11/12 h-5/6 opacity-100 p-10 ml-6">
            <a className="text-xl">
              OUTPUT GOES HERE
            </a>
          </div>
        </div>
        <div className="card w-10 h-full opacity-100"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeWithSessionProvider />
    </SessionProvider>
  );
}
