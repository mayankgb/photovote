import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import Link from "next/link"
import { Login } from "./LandingPage/LoginButton"

export async function Navbar() {

    const session = await getServerSession(authOptions)

    return (
        <div className=" h-16 flex items-center justify-between pt-3 pb-3 px-1 md:px-10">
        <div className="font-bold text-xl">
          PhotoVote
        </div>
        <div className="flex justify-between  md:w-60 w-fit space-x-2 md:space-x-0 items-center h-fit">
          <Link href={"/leaderboard"} className="cursor-pointer font-semibold bg-yellow-300 px-4 py-2 rounded-full">
            Leaderboard
          </Link>
          
          <Login/>
        </div>
      </div>
    )
}