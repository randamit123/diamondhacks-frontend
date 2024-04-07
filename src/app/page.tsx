import {  
  GoogleSignInButton,
} from "@/auth/authButtons";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth/NextAuth";
import { redirect } from "next/navigation";
import Image from "next/image"


export default async function SignInPage() {
  const session = await getServerSession(authConfig);

  if (session) return redirect("/home");

  return (
    <div className="join join-vertical justify-center items-center w-full h-screen bg-gradient-to-br from-[#86efac] from-10% via-[#45B69C] via-30% to-[#0891b2] to-90%">
      <div className="join join-horizontal items-center justify-center w-full h-5/6">
        <div className="card w-3/5 h-full bg-base-100 shadow-xl opacity-90 items-center justify-center">
          <div className="h-5/6 w-5/6 carousel carousel-vertical rounded-box">
          <div className="carousel-item h-full w-full">
            <img src="/PIC1.png" width="120%"/>
          </div> 
          <div className="carousel-item h-full w-full">
            <img src="/PIC2.png" width="120%"/>
          </div> 
          <div className="carousel-item h-full w-full">
            <img src="/PIC3.png" width="120%"/>
          </div>
          <div className="carousel-item h-full w-full">
            <img src="/PIC4.png" width="120%"/>
          </div>
          </div>
        </div>
        <div className="card w-1/4 h-full bg-base-100 shadow-xl">
          <div className="join join-vertical w-full h-full items-center justify-center">
           <Image className="pb-10" src="/logo.png" alt="ReSign Logo" width={350} height={350}></Image>
            <p className="pb-5 text-6xl text-stone-700 font-poppins font-bold mb-3">
              LOG IN
            </p>
             <p className="pb-5 text-xl -mt-3 font-poppins font-bold">Welcome!</p>
            <div className="join join-vertical h-100 w-full items-center pt-7">
              <GoogleSignInButton/>
               <button className="btn btn-accent hidden h-full text-2xl font-poppins"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}