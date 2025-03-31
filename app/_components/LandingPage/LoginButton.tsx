"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function Login() {
    const session = useSession()
    console.log(session)

    function handleClick() {
       redirect("/home")
    }

    return(
        <div onClick={handleClick} className="select-none cursor-pointer text-yellow-300 bg-black rounded-full flex items-center justify-center py-2 font-bold w-24 text-center px-2">
            {session.data ? "Home" : "Login"}
          </div>
    )
}